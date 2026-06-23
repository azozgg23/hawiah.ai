# Basar AI Landing Design

## Selected Direction

This landing page uses the **Minimal Product Narrative** concept.

The design goal is to make Basar AI feel calm, credible, and structured rather than loud or overly futuristic. The product itself is a focused workflow tool: users define a brand, connect their own provider keys, and generate social images with consistent context. The landing page mirrors that product shape by keeping the visual language restrained and deliberate.

## Core Idea

The page communicates that Basar AI is not a generic prompt toy. It is a narrow, organized system that moves from brand context to platform-ready output with very little friction.

The experience is built around three messages:

1. **Clarity**: the user should understand what the product does within a few seconds.
2. **Control**: BYOK, brand isolation, and structured generation are treated as strengths.
3. **Calm confidence**: the page avoids flashy SaaS cliches and instead uses spacing, typography, and composition to create trust.

## Visual System

### Typography

- **Display font**: `Fraunces`
- **Body font**: `Manrope`

`Fraunces` gives the main headlines a refined editorial tone, which helps the page feel intentional and designed rather than templated. `Manrope` keeps the rest of the page clean, readable, and practical.

### Color Palette

- Background base: warm off-white / sand tones
- Primary text: near-black `#181715`
- Accent text: muted brown `#705842`
- Surfaces: translucent white panels with soft borders

This palette is intentionally quiet. It avoids high-saturation startup colors and supports the product story of structure and trust.

### Layout Principles

- Large headline with generous whitespace
- Right-side summary card to compress product facts
- Four-card workflow rail for fast scanning
- Narrative timeline section to explain the product in sequence
- Final CTA with minimal friction

The page is designed to read top-to-bottom as a product story, not just a list of features.

## Section Breakdown

### 1. Header

The header is simple and light. It includes:

- Brand mark and short descriptor
- Two anchor links for internal navigation
- `Log in` and `Start free` actions

This keeps the page usable without crowding the first impression.

### 2. Hero

The hero states the main value proposition:

> The shortest path from brand context to social image.

This line frames the product as a workflow accelerator, not just an image generator.

The supporting paragraph clarifies what the product is not:

- not a noisy creative suite
- not another billing layer
- not a black box with inconsistent output

### 3. Summary Card

The right-side card gives a concise product snapshot:

- core stack and capabilities
- target user profile
- example generation run
- preset/provider count

This acts like a compact briefing panel and helps make the page feel product-driven.

### 4. Workflow Rail

The four cards map the product mental model:

- Brand
- Kit
- Keys
- History

This is the simplest way to explain the app structure without overwhelming the visitor.

### 5. Product Narrative

The narrative section slows the page down and explains the logic of the system in sequence:

1. define the brand perimeter
2. connect provider credentials
3. generate for a real channel
4. preserve operational history

This section is important because the product is workflow-centric. A narrative layout fits the product better than a flashy feature grid.

### 6. Final CTA

The final CTA repeats the product’s strongest differentiator:

> Bring your own keys. Keep your own brand logic.

That line reinforces ownership and control, which is a central product strength.

## Why This Fits Basar AI

This design matches the actual project well because the app is already built around:

- brand-specific workspaces
- structured brand kits
- provider key management
- social preset generation
- generation history

The landing page reflects those realities instead of inventing a marketing story disconnected from the product.

## Files

- Next.js landing page: `frontend/app/page.tsx`
- Landing component: `frontend/components/marketing/landing-page.tsx`
- Standalone HTML preview: `frontend/public/landing-page-minimal-narrative.html`

## Notes For Future Iteration

- Add real product screenshots once the dashboard visual design is stronger.
- Consider subtle reveal animations after the static layout is approved.
- If conversion becomes the priority, test stronger CTA copy in the hero.
- If brand personality becomes the priority, introduce a small amount of illustration or product imagery without losing the calm visual system.
