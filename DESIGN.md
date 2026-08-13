# Design

## Purpose

Define the visual system for Dre's GitHub profile README.

## Visual thesis

An independent founder file: disciplined editorial typography and hard information hierarchy over dense, archival dot-screen sculpture panels. It should feel composed, credible, and slightly severe without becoming theatrical.

## Reference translation

Keep the reference's contrast, sparse structure, monospaced labels, oversized headline, and print-dot sculpture treatment. Change the content rhythm, proportions, copy, and layout so the profile has its own identity.

## Palette

- Ink: near-black.
- Paper: warm off-white.
- Secondary ink: muted gray only for secondary labels.
- No gradients, neon, colored accents, glass, or glow.

## Typography

- Opening name: high-contrast oversized serif treatment, set as `Alexandre Nevero`.
- Supporting facts: semantic Markdown, readable without images.
- Labels and technical measurements: monospaced SVG or Markdown code.
- Keep body copy at normal GitHub-readable size. Never bake core prose into images.

## Image language

- Each portrait is an original Greco-Roman-style sculpture rendered as a full rectangular black field with a dense off-white dot grid.
- The dots continue through the background. The bust emerges by changes in dot density, not by sitting as a cutout on black.
- Crops are close, asymmetrical, and editorial. No real-person resemblance, AI/robot imagery, or museum-photo treatment.
- The opening sculpture field receives a live, editable SVG "Dre" wordmark overlay, positioned at its lower edge. It must stay legible at thumbnail size and avoid covering a face's eye line.

## Logo direction

Primary direction: a restrained "Dre" ligature, built from one confident continuous stroke with a classical calligraphic cadence. The capital D holds the weight; `re` finishes quietly. It should read as a name, not an app icon.

The mark is monochrome, no enclosing badge, no crown, no laurel, no shield, no blockchain symbol, and no generic startup geometry. Use it as a small signature overlay on portraits and as the profile masthead mark.

## Composition

- Opening: `Alexandre Nevero`, then the business-and-product positioning sentence. `Dre` sits inside the lower edge of the right-side sculpture field as the signature.
- Canonical layout: dark C-direction structure, with right-side portrait, hard rules, and B-direction `Focus` / `Portfolio` / `Signal` proof ledger.
- Evidence: three selected-work panels, each with portrait field, wordmark overlay, project, exact role, and one plain description.
- Activity: GitHub statistics in a local SVG, refreshed by Actions or clearly labeled as static snapshot.
- Close: email and LinkedIn.
- Build single-column first. Any multi-panel composition must remain readable when GitHub stacks it on mobile.

## Interaction and motion

The profile is static. No animated SVG, autoplay, hover-only content, or motion dependency.

## Accessibility

- Decorative images need empty alt text. Content-bearing panels need concise descriptive alt text.
- All essential content exists as live Markdown text.
- Text contrast meets WCAG AA against both dark and light GitHub themes.
- Links have descriptive labels.
