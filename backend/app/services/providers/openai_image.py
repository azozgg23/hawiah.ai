import base64
import logging

import httpx

from app.services.providers.base import ProviderError, ProviderResult

logger = logging.getLogger(__name__)

OPENAI_IMAGES_URL = "https://api.openai.com/v1/images/generations"


async def openai_generate(
    *,
    api_key: str,
    prompt: str,
    width: int,
    height: int,
    model: str,
) -> ProviderResult:
    logger.info("openai_generate: model=%s size=%dx%d", model, width, height)
    async with httpx.AsyncClient(timeout=httpx.Timeout(120.0)) as client:
        response = await client.post(
            OPENAI_IMAGES_URL,
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": model,
                "prompt": prompt,
                "size": f"{width}x{height}",
                "response_format": "b64_json",
                "n": 1,
            },
        )
        response.raise_for_status()
        data = response.json()

    try:
        b64 = data["data"][0]["b64_json"]
    except (KeyError, IndexError, TypeError):
        raise ProviderError(
            "EMPTY_RESPONSE",
            "The provider returned no image. Please try again.",
        )

    return ProviderResult(
        image_bytes=base64.b64decode(b64),
        request_id=response.headers.get("x-request-id"),
    )
