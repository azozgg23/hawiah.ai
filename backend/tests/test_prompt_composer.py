from app.services.prompt_composer import compose_full_prompt

USER_PROMPT = "A modern minimal office"
KIT_SUMMARY = "Brand: Acme\nTone: professional\nAudience: founders"


def test_no_kit_no_logo_mode_none():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context_summary=None,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert result == f"Image Request:\n{USER_PROMPT}"


def test_kit_only_mode_none():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context_summary=KIT_SUMMARY,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert result.startswith("Brand Context:\n")
    assert result.endswith(f"Image Request:\n{USER_PROMPT}")
    assert "Incorporate the brand logo" not in result


def test_logo_mode_prompt_with_logo_no_kit():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context_summary=None,
        logo_mode="prompt",
        brand_has_logo=True,
    )
    assert "Incorporate the brand logo naturally into the image." in result
    assert result.endswith(f"Image Request:\n{USER_PROMPT}")


def test_logo_mode_prompt_without_logo_omits_instruction():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context_summary=None,
        logo_mode="prompt",
        brand_has_logo=False,
    )
    assert "Incorporate the brand logo" not in result


def test_logo_mode_watermark_never_adds_prompt_instruction():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context_summary=None,
        logo_mode="watermark",
        brand_has_logo=True,
    )
    assert "Incorporate the brand logo" not in result


def test_logo_mode_both_with_logo_adds_instruction():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context_summary=None,
        logo_mode="both",
        brand_has_logo=True,
    )
    assert "Incorporate the brand logo naturally into the image." in result


def test_logo_mode_both_without_logo_omits_instruction():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context_summary=None,
        logo_mode="both",
        brand_has_logo=False,
    )
    assert "Incorporate the brand logo" not in result


def test_kit_and_logo_prompt_ordering():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context_summary=KIT_SUMMARY,
        logo_mode="prompt",
        brand_has_logo=True,
    )
    kit_idx = result.index("Brand Context:")
    logo_idx = result.index("Incorporate the brand logo")
    user_idx = result.index("Image Request:")
    assert kit_idx < logo_idx < user_idx
