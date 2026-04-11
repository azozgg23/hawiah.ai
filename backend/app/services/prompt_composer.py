def compose_full_prompt(
    *,
    user_prompt: str,
    brand_context_summary: str | None,
    logo_mode: str,
    brand_has_logo: bool,
) -> str:
    parts: list[str] = []
    if brand_context_summary:
        parts.append(f"Brand Context:\n{brand_context_summary}")
    if logo_mode in ("prompt", "both") and brand_has_logo:
        parts.append("Incorporate the brand logo naturally into the image.")
    parts.append(f"Image Request:\n{user_prompt}")
    return "\n\n".join(parts)
