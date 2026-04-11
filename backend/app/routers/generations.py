import asyncio
import logging
from datetime import datetime, timezone
from uuid import UUID, uuid4

from fastapi import APIRouter, Depends, HTTPException, status

from app.config import settings
from app.core.auth import User, get_current_user
from app.core.supabase import get_service_client
from app.core.vault import read_secret
from app.models.generation import (
    GenerateRequest,
    GenerationResponse,
    GenerationStatusEnum,
    LogoModeEnum,
    ProviderEnum,
)
from app.services.error_mapping import classify_provider_error
from app.services.postprocess import resize_to_preset
from app.services.presets import (
    MODEL_FOR_PROVIDER,
    PLATFORM_PRESETS,
    PRESET_TO_ASPECT_RATIO,
    build_download_filename,
)
from app.services.prompt_composer import compose_full_prompt
from app.services.providers.base import ProviderError, ProviderResult
from app.services.providers.gemini_image import gemini_generate
from app.services.providers.openai_image import openai_generate
from app.services.watermark import apply_watermark

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/brands/{brand_id}", tags=["generations"])


def _error_response(status_code: int, code: str, message: str) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail={
            "error": {
                "code": code,
                "message": message,
                "request_id": str(uuid4()),
            }
        },
    )


def _get_brand_or_404(brand_id: UUID, user_id: str) -> dict:
    client = get_service_client()
    result = (
        client.table("brands")
        .select("*")
        .eq("id", str(brand_id))
        .eq("owner_user_id", user_id)
        .maybe_single()
        .execute()
    )
    if result is None or result.data is None:
        raise _error_response(404, "BRAND_NOT_FOUND", "Brand not found")
    return result.data


def _get_active_key_or_400(brand_id: UUID, provider: str) -> dict:
    client = get_service_client()
    result = (
        client.table("provider_keys")
        .select("*")
        .eq("brand_id", str(brand_id))
        .eq("provider", provider)
        .eq("is_active", True)
        .maybe_single()
        .execute()
    )
    if result is None or result.data is None:
        raise _error_response(
            400,
            "NO_ACTIVE_KEY",
            f"No active {provider} key for this brand. Add or activate a key on the Keys page.",
        )
    return result.data


def _get_brand_kit_summary(brand_id: UUID) -> str | None:
    client = get_service_client()
    result = (
        client.table("brand_kits")
        .select("summary, status")
        .eq("brand_id", str(brand_id))
        .maybe_single()
        .execute()
    )
    if result is None or result.data is None:
        return None
    if result.data.get("status") != "complete":
        return None
    return result.data.get("summary")


def _mark_failed(generation_id: UUID, code: str, message: str) -> None:
    client = get_service_client()
    now = datetime.now(timezone.utc).isoformat()
    client.table("generations").update(
        {
            "status": "failed",
            "error_code": code,
            "error_message": (message or "")[:1000],
            "completed_at": now,
        }
    ).eq("id", str(generation_id)).execute()


def _build_response(row: dict, brand_name: str) -> GenerationResponse:
    image_url = None
    download_filename = None
    if row.get("image_path") and row.get("completed_at"):
        image_url = (
            f"{settings.SUPABASE_URL}/storage/v1/object/public/"
            f"{settings.STORAGE_BUCKET}/{row['image_path']}"
        )
        completed_at = row["completed_at"]
        if isinstance(completed_at, str):
            completed_at = datetime.fromisoformat(completed_at.replace("Z", "+00:00"))
        download_filename = build_download_filename(
            brand_name=brand_name,
            preset_identifier=row["platform_preset"],
            completed_at=completed_at,
        )
    return GenerationResponse(
        id=row["id"],
        prompt=row["prompt"],
        provider=row["provider"],
        model=row["model"],
        platform_preset=row["platform_preset"],
        width=row["width"],
        height=row["height"],
        logo_mode=row["logo_mode"],
        status=row["status"],
        image_url=image_url,
        download_filename=download_filename,
        error_code=row.get("error_code"),
        error_message=row.get("error_message"),
        created_at=row["created_at"],
        completed_at=row.get("completed_at"),
    )


@router.post("/generate", response_model=GenerationResponse)
async def generate_image(
    brand_id: UUID,
    body: GenerateRequest,
    current_user: User = Depends(get_current_user),
) -> GenerationResponse:
    brand = _get_brand_or_404(brand_id, current_user.id)
    brand_name = brand["name"]
    brand_has_logo = bool(brand.get("logo_path"))

    if body.logo_mode in (LogoModeEnum.watermark, LogoModeEnum.both) and not brand_has_logo:
        raise _error_response(
            400,
            "LOGO_REQUIRED",
            "This logo mode requires an uploaded brand logo. Please upload a logo on the Settings page.",
        )

    preset_w, preset_h, _label = PLATFORM_PRESETS[body.platform_preset.value]

    active_key = _get_active_key_or_400(brand_id, body.provider.value)

    brand_context_summary = _get_brand_kit_summary(brand_id)

    generation_id = uuid4()
    resolved_model = MODEL_FOR_PROVIDER[body.provider.value]

    client = get_service_client()
    client.table("generations").insert(
        {
            "id": str(generation_id),
            "brand_id": str(brand_id),
            "prompt": body.prompt,
            "provider": body.provider.value,
            "model": resolved_model,
            "platform_preset": body.platform_preset.value,
            "width": preset_w,
            "height": preset_h,
            "logo_mode": body.logo_mode.value,
            "status": "pending",
        }
    ).execute()

    logger.info(
        "generate start generation_id=%s brand_id=%s provider=%s preset=%s logo_mode=%s",
        generation_id, brand_id, body.provider.value,
        body.platform_preset.value, body.logo_mode.value,
    )

    try:
        client.table("generations").update({"status": "processing"}).eq(
            "id", str(generation_id)
        ).execute()

        full_prompt = compose_full_prompt(
            user_prompt=body.prompt,
            brand_context_summary=brand_context_summary,
            logo_mode=body.logo_mode.value,
            brand_has_logo=brand_has_logo,
        )

        api_key = read_secret(active_key["vault_secret_id"])

        try:
            if body.provider is ProviderEnum.openai:
                result: ProviderResult = await asyncio.wait_for(
                    openai_generate(
                        api_key=api_key,
                        prompt=full_prompt,
                        width=preset_w,
                        height=preset_h,
                        model=resolved_model,
                    ),
                    timeout=120.0,
                )
            else:
                aspect_ratio = PRESET_TO_ASPECT_RATIO[body.platform_preset.value]
                result = await asyncio.wait_for(
                    asyncio.to_thread(
                        gemini_generate,
                        api_key=api_key,
                        prompt=full_prompt,
                        aspect_ratio=aspect_ratio,
                        model=resolved_model,
                    ),
                    timeout=120.0,
                )
        except asyncio.TimeoutError:
            raise ProviderError(
                "TIMEOUT",
                "The request took too long to complete. Please try again.",
            )
        except ProviderError:
            raise
        except Exception as exc:
            code, user_msg = classify_provider_error(exc)
            raise ProviderError(code, user_msg)

        image_bytes = resize_to_preset(result.image_bytes, preset_w, preset_h)

        if (
            body.logo_mode in (LogoModeEnum.watermark, LogoModeEnum.both)
            and brand_has_logo
        ):
            logo_bytes = client.storage.from_(settings.STORAGE_BUCKET).download(
                brand["logo_path"]
            )
            image_bytes = apply_watermark(image_bytes, logo_bytes)

        image_path = f"brands/{brand_id}/generations/{generation_id}.png"
        client.storage.from_(settings.STORAGE_BUCKET).upload(
            image_path,
            image_bytes,
            {"content-type": "image/png", "upsert": "false"},
        )

        now_iso = datetime.now(timezone.utc).isoformat()
        updated = (
            client.table("generations")
            .update(
                {
                    "status": "succeeded",
                    "image_path": image_path,
                    "provider_request_id": result.request_id,
                    "completed_at": now_iso,
                }
            )
            .eq("id", str(generation_id))
            .execute()
        )

        client.table("provider_keys").update({"last_used_at": now_iso}).eq(
            "id", active_key["id"]
        ).execute()

        row = updated.data[0] if updated.data else None
        if row is None:
            row = (
                client.table("generations")
                .select("*")
                .eq("id", str(generation_id))
                .single()
                .execute()
                .data
            )
        logger.info(
            "generate success generation_id=%s brand_id=%s",
            generation_id, brand_id,
        )
        return _build_response(row, brand_name)

    except ProviderError as e:
        _mark_failed(generation_id, e.code, e.user_message)
        logger.info(
            "generate failed code=%s generation_id=%s brand_id=%s",
            e.code, generation_id, brand_id,
        )
        raise _error_response(502, e.code, e.user_message)
    except Exception:
        logger.exception(
            "generate pipeline unexpected error generation_id=%s brand_id=%s",
            generation_id, brand_id,
        )
        _mark_failed(
            generation_id, "INTERNAL_ERROR", "Internal error"
        )
        raise _error_response(
            500,
            "INTERNAL_ERROR",
            "Something went wrong. Please try again.",
        )
