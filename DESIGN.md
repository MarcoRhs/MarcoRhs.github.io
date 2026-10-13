---
name: Marco Rohns — Portfolio & Grounded CV
description: A near-white evidence bench where dark instrument slabs carry the proof, and one system blue is the only voice that acts.
colors:
  canvas: "#ffffff"
  surface: "#ffffff"
  subtle: "#f5f5f7"
  ink: "#1d1d1f"
  slab: "#151517"
  muted: "#6e6e73"
  body-secondary: "#424245"
  line: "#d2d2d7"
  hairline: "#e4e4e8"
  blue: "#0071e3"
  blue-hover: "#0077ed"
  blue-soft: "#eaf4ff"
  blue-on-slab: "#8fc8ff"
  mint: "#a8efd1"
  mint-dim: "#91d8bf"
  live-green: "#56d898"
  warn: "#a24b00"
  on-blue: "#ffffff"
  on-slab: "#ffffff"
  on-slab-muted: "#b2b2b7"
  glass-fill: "rgba(250, 252, 255, .76)"
  glass-stroke: "rgba(255, 255, 255, .84)"
typography:
  display:
    fontFamily: "Bricolage Grotesque, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif"
    fontSize: "clamp(56px, 6.15vw, 82px)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.058em"
  headline:
    fontFamily: "Bricolage Grotesque, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif"
    fontSize: "clamp(42px, 5vw, 66px)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.052em"
  title:
    fontFamily: "Bricolage Grotesque, -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.04em"
  lead:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "21px"
    fontWeight: 400
    lineHeight: 1.48
    letterSpacing: "normal"
  body:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.52
    letterSpacing: "normal"
  action:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "16px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  label:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.045em"
  meta:
    fontFamily: "IBM Plex Sans, -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Segoe UI', sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
rounded:
  control: "13px"
  sm: "20px"
  md: "26px"
  lg: "32px"
  xl: "38px"
  pill: "999px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "28px"
  xl: "48px"
  hero: "72px"
  section: "118px"
components:
  button-primary:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.on-blue}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 19px"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.blue-hover}"
  button-secondary:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 19px"
    height: "46px"
  button-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 19px"
    height: "46px"
  button-outline:
    textColor: "{colors.on-slab}"
    typography: "{typography.action}"
    rounded: "{rounded.pill}"
    padding: "0 19px"
    height: "46px"
  nav-link:
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "8px 9px"
  nav-link-hover:
    textColor: "{colors.ink}"
    backgroundColor: "rgba(255, 255, 255, .76)"
  nav-cta:
    backgroundColor: "rgba(0, 113, 227, .92)"
    textColor: "{colors.on-blue}"
    rounded: "{rounded.pill}"
    padding: "8px 14px"
    height: "42px"
  chip:
    backgroundColor: "rgba(255, 255, 255, .64)"
    textColor: "#334155"
    rounded: "{rounded.pill}"
    padding: "8px 11px"
    height: "38px"
  chip-hover:
    textColor: "{colors.blue}"
  input-askbox:
    backgroundColor: "rgba(255, 255, 255, .78)"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "16px"
  card-light:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "28px"
    padding: "{spacing.lg}"
  card-quiet:
    backgroundColor: "{colors.subtle}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "25px"
  slab:
    backgroundColor: "{colors.slab}"
    textColor: "{colors.on-slab}"
    rounded: "{rounded.lg}"
    padding: "34px"
  panel-glass:
    backgroundColor: "{colors.glass-fill}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "30px"
---

# Design System: Marco Rohns — Portfolio & Grounded CV

## Overview

**Creative North Star: "The Evidence Bench"**

Every claim on this site is laid out as an artifact under even light. The canvas is pure white with a single cool blue bloom in the upper right; onto it are set dark instrument slabs, quiet grey trays and one translucent glass panel. Nothing is styled to persuade — the design's whole job is to present verifiable objects and let the reader pick them up: a proof strip of four facts, metric grids with hairline dividers, checked lists, source links, and a live assistant the visitor can interrogate directly. Where a lesser portfolio would assert, this one exhibits.

The density is deliberately uneven, and that unevenness is the system. Light sections breathe (118px of vertical section padding, 630–780px measure on headings and body) so the recruiter's eye can skim four facts in two seconds. The dark slabs compress (34px padding, 1px hairlines at 12–13% white, 11–15px metric type) so the engineering reader gets instrument density where density is the point. The same page serves a sixty-second scan and a close technical read because it changes its own weather between sections.

Expression lives almost entirely in two places: the enormous, tightly-tracked display type (down to −0.058em at 82px, leading below 1) and the signature rotating conic border that traces the edge of exactly four surfaces. Everything else is restrained to the point of plainness. There is no second accent, no illustration, no decorative texture, no gradient on type. The one thing that moves on its own is the thing that is genuinely live.

**Key Characteristics:**

- Near-white field (`#ffffff`) with a single radial blue bloom at 88% 6%, 8% opacity — no second background treatment anywhere
- Dark instrument slabs (`#151517`, `#1d1d1f`) for product, process and contact; quiet grey trays (`#f5f5f7`) for supporting cards
- One accent: System Blue (`#0071e3`). It is the only color that means "act" or "navigate"
- Evidence Mint (`#a8efd1`) appears **only** on dark surfaces, and only where something is live or verified
- Display type as the primary visual gesture: weight 700, tracking to −0.058em, leading to 0.98
- Pill geometry for every control; generously rounded rectangles (20–38px) for every surface
- Tonal depth, atmospheric shadow: wide, soft, low-opacity shadows that read as ambient light, never as a lift
- An animated conic-gradient border on four surfaces — the system's only self-initiated motion
- Live signal pulses (status dot, live badge, timeline nodes) on a 2.6–3.2s cycle
- Fully degrading: reduced motion, reduced transparency, increased contrast, forced colors and print all have real fallbacks

## Colors

A one-accent system on an uncontaminated white field: the palette's character comes from restraint on light surfaces and from near-black depth on the slabs, with mint reserved as the single marker of liveness.

### Primary

- **System Blue** (`#0071e3`): The only interactive and navigational voice on light surfaces. Primary buttons, all eyebrow/kicker labels, inline links, source labels, card list markers, the scroll-progress bar, timeline nodes, focus rings. Hover deepens to **System Blue Hover** (`#0077ed`).
- **System Blue Soft** (`#eaf4ff`): The accent's only tint. Focus-ring halo on the ask box (`0 0 0 4px`), role-fit pills, fit-panel cells.
- **System Blue on Slab** (`#8fc8ff`): The accent lifted for dark surfaces, where `#0071e3` fails contrast. Eyebrows and step numerals inside the dark approach, architecture and decision panels.

### Secondary

- **Evidence Mint** (`#a8efd1`): Liveness and verification, on dark surfaces only. Case links on the product slab, the brightest stop in the rotating border, the ManeMap card's hover edge. **Evidence Mint Dim** (`#91d8bf`) marks the checked items in case lists; **Live Green** (`#56d898`) is the pulsing dot in the live badge and availability line.

### Neutral

- **Canvas / Surface** (`#ffffff`): The page field and the raised light card. Identical values, different roles — the card separates by hairline and shadow, never by tone.
- **Ink Slab** (`#151517`): The deepest surface. The hero profile card and the ManeMap product case; reads as sealed equipment on the bench.
- **Ink** (`#1d1d1f`): Primary text on light, and the fill for the approach and contact slabs. The near-black that is never pure black.
- **Body Secondary** (`#424245`): Dense supporting text inside light cards — capability list items, answer detail values.
- **Muted** (`#6e6e73`): Section intros, hints, metric captions, inactive nav. The workhorse secondary — the single most-used token in the stylesheet (26 references).
- **Subtle** (`#f5f5f7`): The quiet tray. Credential cards, the adoption case, assistant answer bubbles.
- **Line** (`#d2d2d7`): Section dividers and timeline rules. **Hairline** (`#e4e4e8`) is the lighter weight used for card edges.
- **Glass Fill** (`rgba(250, 252, 255, .76)`) over **Glass Stroke** (`rgba(255, 255, 255, .84)`): the sticky header, the ask panel, the secondary button, chips. Always paired with `backdrop-filter: saturate(160–180%) blur(18–24px)`.
- **Warn** (`#a24b00`): Assistant error text. The only non-blue, non-mint signal color in the system.

### Named Rules

**The One Voice Rule.** System Blue is the only color that acts. If an element is interactive on a light surface, it is blue, blue-tinted, or ink; if it is blue, it had better be interactive or a label pointing at something. No decorative use, ever.

**The Mint-On-Dark Rule.** Evidence Mint exists only on dark surfaces, and only to mark something live or verified. Mint on white is off-system — on light surfaces, "live" is Live Green at dot scale, never a mint field.

**The Never-Black Rule.** No surface or text uses `#000`. The darkest text is Ink (`#1d1d1f`); the darkest surface is Ink Slab (`#151517`). Pure black appears only inside shadow and mask color functions.

**The Single Bloom Rule.** The page carries exactly one background gradient: a blue radial at 88% 6%, 8% opacity. Slabs may each carry their own internal bloom; the light field gets one and only one.

## Typography

**Display Font:** Bricolage Grotesque (600, 700), with `-apple-system` / `BlinkMacSystemFont` / `SF Pro Display` / `Segoe UI` fallback
**Body Font:** IBM Plex Sans (400, 500, 600), with `-apple-system` / `BlinkMacSystemFont` / `SF Pro Text` / `Segoe UI` fallback

Both families are self-hosted in `fonts/` under the SIL OFL, declared with `@font-face` at the top of `style.css`, and exposed as the `--font-display` and `--font-body` custom properties. The display face (Bricolage 700) and the body face (Plex 400) are preloaded on every page; the 500 and 600 faces arrive with the stylesheet. The system stack remains as the fallback inside each stack, which is what renders during the `font-display: swap` window.

**Character:** A high-contrast pairing: Bricolage Grotesque's slightly eccentric, condensed-feeling grotesque carries the headlines at enormous sizes and brutal negative tracking, while IBM Plex Sans stays open, neutral and technical underneath. The display type is the loudest thing in the system; the body type is deliberately the quietest.

### Hierarchy

- **Display** (700, `clamp(56px, 6.15vw, 82px)`, leading 0.98, tracking −0.058em): Page-opening H1 only — the portfolio hero and the architecture hero. Drops to 45–58px below 760px and a flat 43px below 390px.
- **Headline** (700, `clamp(42px, 5vw, 66px)`, leading 1, tracking −0.052em): Section H2s and the contact call. Hard-set to 41–42px on mobile.
- **Title** (700, 22–28px, leading 1.08–1.12, tracking −0.035em to −0.04em): Card and stage headings. 28px on capability cards, 24px on credential/decision/process cards, 22px on architecture stages.
- **Lead** (400, 18–21px, leading 1.48–1.52): The one paragraph under a display or headline. 21px in the hero, 18px under section headings, 16px on mobile.
- **Body** (400, 17px, leading 1.52): Default running text. Measure capped by `max-width` (630px under headings, 650–760px on leads, 840px on assistant answers) rather than by a `ch` rule.
- **Action** (500, 16px): Button and primary control labels. 14px (600) on compact controls — assistant buttons, nav CTA, case links.
- **Label** (600, 13px, tracking 0.045em, uppercase): Every eyebrow, panel eyebrow and card kicker. Always System Blue on light, Blue-on-Slab on dark. The tracking widens to 0.05–0.08em on the smallest variants (11–12px) in dark panels and the chips label.
- **Meta** (400, 11–12px, leading 1.35–1.45): Metric captions, footer, privacy line, proof-strip subtext. The system's floor — nothing is set smaller than 11px.

### Named Rules

**The Tracking-Follows-Size Rule.** Negative tracking scales with type size and is never applied below 17px: −0.058em at display, −0.052em at headline, −0.035/−0.04em at title, −0.02em on the proof strip, `normal` everywhere in body and below. Positive tracking is the inverse — it belongs only to uppercase labels at 11–13px.

**The One Lead Rule.** A heading gets exactly one supporting paragraph before the content begins. The eyebrow → headline → single lead triad is the only section-opening structure in the system.

**The Numeral-First Rule.** In every metric cell — proof strip, case proof, profile metrics, fit panel — the number or fact is the `<strong>`/`<b>` on its own line and the caption is the muted 11–12px line beneath it. Never the reverse.

## Layout

A single centered shell (`max-width: 1280px`, 32px side padding, 20px below 760px) holding full-width sections separated by 1px top borders rather than background changes.

**Grids.** The page runs on asymmetric two-column splits and even multi-column strips: the hero at `1.12fr / minmax(430px, .88fr)` with a 72px gap, the case grid at `1.12fr / .88fr`, the ask section at `.68fr / minmax(500px, 1.32fr)` with a 76px gap, the product evidence at `.84fr / minmax(470px, 1.16fr)`, the contact slab at `1.4fr / minmax(280px, .6fr)`. Supporting rows are even: capability and credential grids at `repeat(3, 1fr)`, the process flow and proof strip at `repeat(4, 1fr)`. Card gaps are tight — 12–16px — so grouped cards read as one object.

**Rhythm.** Vertical section padding is 118px on light sections and 120px on the ask section, compressing to 84–86px below 760px. Dark slabs carry their own internal padding (82px × 72px on the approach section, 68px on contact, 34px on case cards) and sit flush in the flow with 16px of separation. Within a card: 28px heading offset from the kicker, 14–15px heading-to-body, 27px before a list.

**Hairline trays.** Metric groups are built as 1px-gap grids over a tinted background, so the background shows through as dividers: the proof strip over `#dceafb`, case proof over `rgba(255,255,255,.13)`, the fit panel over `#dfeaf6`. No borders on the cells themselves.

**Responsive behavior.** Four breakpoints, each with a specific job:

- **1040px** — asymmetric splits collapse to single column; 3-up grids become 1-up; the first nav link is dropped to protect the header; architecture stages go 2-up and lose their connector arrows.
- **760px** — the real mobile rewrite. Nav collapses into a 320px glass drawer behind a 44px toggle; the process flow rotates from a horizontal connector to a vertical rail with a −43px negative-margin hang; the product shots switch from fixed 560px heights to `min(46%, 170px)`; every radius steps down one notch; dark slabs break the shell with −4px side margins to run nearly edge-to-edge; all controls reach a 44px minimum.
- **390px** — the brand wordmark hides to leave the portrait, buttons go full width, the live product card stacks.
- Touch and coarse pointers get the rotating border on a 24s `steps(96)` animation instead of continuous rotation — deliberate battery and jank insurance.

**Sticky behavior.** The header floats at `top: 10px` with a 22px radius (a detached capsule, not a bar), and the ask intro sticks at `top: 106px` beside the scrolling panel. `scroll-padding-top: 90px` keeps anchored sections clear of the floating header.

### Named Rules

**The Hairline-Gap Rule.** Grouped metrics are never bordered individually. Build them as a 1px-gap grid on a tinted parent with `overflow: hidden` and let the parent color become the dividers.

**The Edge-Break Rule.** Below 760px, dark slabs extend 4px past the shell on both sides. They are the only elements permitted to break the container.

## Elevation & Depth

Depth is tonal first; shadow is atmosphere, not structure. The stack reads white canvas → white card (separated by hairline, not tone) → grey tray (`#f5f5f7`) → glass panel (translucent, blurred) → ink slab (`#1d1d1f`) → deep slab (`#151517`). That tonal ladder carries the entire sense of layering. Shadows are then wide, very soft and very low in opacity — 24 to 80px of blur at 4–20% — so they read as ambient light pooling under an object rather than as a lift. Nothing in the system casts a tight, dark, contacty shadow. Interactive surfaces answer with a 2–4px translate and a slightly deeper pool; they never jump an elevation step.

Two depth devices do heavier lifting than the shadows. Inset highlights (`inset 0 1px 0 rgba(255,255,255,.95–.98)`) put a lit top edge on every glass surface, which is what makes the header and ask panel feel like physical plates. And radial blooms inside the dark slabs — a blue at one corner, a mint at the other, at 17–50% opacity — give the near-black surfaces internal atmosphere instead of flatness.

### Shadow Vocabulary

- **Card at rest** (`box-shadow: 0 12px 32px rgba(29, 29, 31, .045)`): Light cards on canvas. Almost subliminal — it exists to separate white from white.
- **Card raised** (`box-shadow: 0 18px 38px rgba(29, 29, 31, .09)`): Hover state for capability and credential cards, paired with `translateY(-4px)`.
- **Glass plate** (`box-shadow: 0 20px 56px rgba(22, 34, 54, .11), inset 0 1px 0 rgba(255, 255, 255, .98), inset 0 -1px 0 rgba(113, 135, 158, .1)`): The ask panel. The `--glass-shadow` token plus a lit top edge and a cool bottom edge.
- **Floating header** (`box-shadow: 0 10px 30px rgba(29, 29, 31, .08), inset 0 1px 0 rgba(255, 255, 255, .96)`): Detached capsule over scrolling content.
- **Slab** (`box-shadow: 0 24px 60px rgba(29, 29, 31, .14–.16)`, deep variant `0 32px 80px rgba(22, 34, 54, .2)`): Dark surfaces. Wide and diffuse at low opacity, so the slab appears to rest in light rather than hover above it.
- **Accent lift** (`box-shadow: 0 8px 22px rgba(0, 113, 227, .2)`, hover `0 11px 28px rgba(0, 113, 227, .26)`): Primary buttons only. The shadow is tinted with its own fill color.
- **Focus halo** (`box-shadow: 0 0 0 4px var(--blue-soft)`): The ask box's focus-within state, alongside a blue border.
- **Signal halo** (`box-shadow: 0 0 0 4–5px rgba(<signal>, .09–.12)`): Status dots and timeline nodes; animates out to `0 9px` transparent on the pulse.

### Named Rules

**The Atmosphere Rule.** Shadows are wide (≥24px blur) and faint (≤20% alpha). A tight, dark shadow is off-system; if a surface needs more presence, change its tone or add a hairline, don't deepen the shadow.

**The Tinted-Shadow Rule.** A colored surface casts a shadow tinted with its own hue — blue buttons cast blue, slabs cast the cool `rgba(22, 34, 54, …)` rather than neutral grey. Never a generic black shadow under a colored element.

**The Lit-Edge Rule.** Every translucent surface carries `inset 0 1px 0` of near-white on its top edge. That highlight, not the blur, is what makes glass read as glass.

## Shapes

Generously rounded rectangles and true pills, with nothing sharp anywhere. The form language has two registers: **controls are pills** (`999px` — every button, nav link, chip, badge, tag, store link and selector) and **surfaces are soft rectangles** (20–38px, scaling with the surface's size). Circles (`50%`) are reserved for portraits and signal dots. Radius scales down one step at the 760px breakpoint, so a 32px case card becomes 26px and a 38px approach section becomes 30px — the geometry tightens with the viewport rather than staying fixed.

Borders are hairlines or nothing: 1px of `#e4e4e8`/`#d2d2d7` on light surfaces, 1px of `rgba(255,255,255,.12–.20)` on dark ones. No border is ever thicker than 1px except the portrait's 3px white ring and the rotating border's 1–3px conic trace.

**Normative radius scale** (`rounded` in the frontmatter):

| Token | Value | Applies to |
|---|---|---|
| `control` | 13px | Nav toggle, process-flow numerals, skip link |
| `sm` | 20px | Ask box, answer bubbles, inner cells |
| `md` | 26px | Proof strip, credential cards, mobile slabs |
| `lg` | 32px | Case cards, ask panel |
| `xl` | 38px | The approach section — the largest surface radius |
| `pill` | 999px | Every control, badge, tag and selector |
| `circle` | 50% | Portraits, status and signal dots |

> **Observed drift.** The shipped CSS contains 24 distinct radius values (10, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 30, 32, 34, 36, 38px plus `999px` and `50%`), many separated by a single pixel with no systemic reason — `19px` and `21px` and `23px` all appear as one-offs. The table above is the normative scale derived from the real clusters; the off-scale values are legacy and should collapse onto the nearest step as files are touched. This is recorded, not yet fixed.

### Named Rules

**The No-Sharp-Corner Rule.** Nothing in this system has a 0 radius. The smallest radius in use is 2px (the nav toggle's bars and the scroll-progress track); every real surface is ≥13px.

**The Pill-For-Action Rule.** If it is a control, it is a pill. A rounded-rectangle button is off-system.

**The Radius-Follows-Size Rule.** Radius scales with surface area and with viewport. Bigger surface, bigger radius; smaller viewport, one step down.

## Components

### Buttons

- **Shape:** Full pill (`999px`), 46px tall, 19px horizontal padding, flex-centered with an 8px gap for a trailing glyph.
- **Primary:** System Blue fill (`#0071e3`), white text, weight 500 at 16px, with a blue-tinted lift (`0 8px 22px rgba(0,113,227,.2)`). Hover deepens the fill to `#0077ed`, strengthens the shadow and raises the button 2px; a contained arrow glyph slides 3px in its direction of travel.
- **Secondary:** Glass — `rgba(245,245,247,.72)` behind `blur(12px) saturate(150%)`, a near-white 1px border, a lit inset top edge, ink text. Hover settles to `rgba(232,232,237,.82)`.
- **On slab:** **Light** (white fill, ink text, hover `#f2f2f5`) is the primary action on dark surfaces; **Outline** (transparent, `rgba(255,255,255,.28)` border, white text, hover `rgba(255,255,255,.1)`) is its secondary.
- **Compact controls** (assistant Ask/Stop, nav CTA, store links): same pill, 40–44px tall, 14px at weight 600. Disabled is `opacity: .5` with a default cursor — never a color change.
- **Focus:** `3px solid var(--blue)` at `3px` offset, globally, on every focusable element. On the dark ManeMap card it becomes a mint outline for contrast.
- Below 390px, buttons go `width: 100%`.

### Chips

- **Style:** Glass pill — `rgba(255,255,255,.64)` fill, near-white 1px border, lit inset top edge, slate text (`#334155`), 13px, left-aligned, 38px minimum height (44px on mobile).
- **State:** Hover shifts both the border and the text to System Blue with no fill change. Disabled is `opacity: .52` — used while a question is in flight. These are suggestion chips, not filters: there is no selected state.

### Cards / Containers

- **Light card** (`.capability-card`): White on white, 28px radius, 28px padding, 1px `#e4e4e8` border, the near-subliminal rest shadow, 340px minimum height on desktop. A blue 13px numeral sits at the top with a 48px gap before the heading. Lists inside are top-bordered rows at 9px vertical padding with a blue `→` marker.
- **Quiet tray** (`.credential-card`, `.adoption-case`): `#f5f5f7` fill, 24–26px radius, 25px padding, no shadow. Tone alone does the separating.
- **Slab** (`.product-case`, `.approach-section`, `.contact-section`): `#151517` or `#1d1d1f`, 32–38px radius, 34–68px padding, a radial bloom in one corner, white text with `#b2b2b7` secondary. Internal dividers are `rgba(255,255,255,.12)`.
- **Hover:** Light cards and trays rise 4px into the raised shadow; slabs rise 3px with no shadow change. 180ms, `ease`.

### Inputs / Fields

- **Ask box:** A bordered container, not a bare field — `rgba(255,255,255,.78)` fill, 20px radius, 16px padding, near-white border, soft shadow with a white inset top edge. The label sits above at 13px muted; the textarea itself is borderless and transparent at 18px with an 82px minimum height and `resize: none`.
- **Focus:** Handled on the container via `:focus-within` — the border becomes System Blue and a `0 0 0 4px` Blue Soft halo appears. The textarea itself shows no ring of its own.
- **Placeholder:** `#86868b`.
- **Error:** The assistant's error text is Warn (`#a24b00`); an unreachable-service notice renders in a `#fff6ed` 16px-radius panel with a mailto fallback.

### Navigation

- **Desktop:** A floating glass capsule — sticky at `top: 10px`, 60px tall, 22px radius, `rgba(250,250,252,.76)` behind `blur(18px) saturate(180%)`, hairline white border, lit top edge. Links are 14px muted pills that fill with white on hover and sit at `rgba(255,255,255,.92)` when current. A blue CTA pill sits at the right end, and a 2px scroll-progress rail runs along the capsule's bottom edge, inset 18px, scaling from the left.
- **Mobile (≤760px):** The link row becomes a `min(320px, 100vw - 40px)` glass drawer dropped 8px below the header with an 18px radius, opened by a 44px hamburger whose three bars rotate into an X. The toggle is shown only when `.js` is present, so the no-JS page keeps its visible links. Drawer links are 44px tall at 15px in full ink.

### Rotating Border (signature)

The system's one piece of self-initiated motion, and its most distinctive element. A conic gradient — transparent for roughly two-thirds of its sweep, then blooming through mint (`#a8efd1`) into blue (`#1677ea`) with a near-white hot spot — is painted on an `::after` pseudo-element, clipped to a 1–3px rim by a `mask-composite: exclude` double-mask, and rotated by animating a registered `@property --rotating-border-angle`.

- **Applied to exactly four surfaces**, each with a deliberately different period and a negative delay so they never synchronize: the ManeMap case (8s, −3s, 3px rim, brightest gradient), the live product card in the hero (10s), the ask panel (14s, −7s, 0.88 opacity), the contact section (16s, −11s, 0.82 opacity).
- **`.panel-border`** thickens the rim to 2px and adds a `drop-shadow` glow in blue.
- **Degradation is complete:** wrapped in an `@supports` test for `mask-composite`; frozen at a static 42deg under `prefers-reduced-motion: reduce`; reduced to 24s `steps(96)` on coarse-pointer devices; `display: none` under `forced-colors: active` and in print.

### Metric Tray (signature)

The recurring evidence device: a `repeat(n, 1fr)` grid with `gap: 1px` over a tinted background and `overflow: hidden`, so the parent color shows through as hairline dividers. Each cell is a fact in 15–17px `<strong>` over an 11–12px muted caption. Appears as the proof strip (4-up over `#dceafb`), case proof (3-up over `rgba(255,255,255,.13)`), profile metrics (2-up) and the fit panel (3-up over `#dfeaf6`). It is the layout expression of the Evidence Bench.

### Assistant Thread

Questions render as 17px weight-600 lines; answers as a `#f5f5f7` bubble at 20px radius with 18–20px padding, rising 5px on a 250ms `ease-out` entrance. Structured details render as a two-column definition grid (`minmax(135px, .35fr) / 1fr`) with top-bordered rows, collapsing to a single column on mobile. Each answer closes with a blue 13px source label. Status text is muted italic.

## Do's and Don'ts

### Do:

- **Do** keep System Blue (`#0071e3`) as the only accent. If something needs emphasis and isn't interactive, use tone, weight or a hairline tray — not a second color.
- **Do** reserve Evidence Mint for dark surfaces and for liveness or verification only.
- **Do** scale negative tracking with type size (−0.058em display → −0.052em headline → −0.04em title → `normal` at body) and never apply it below 17px.
- **Do** build grouped metrics as 1px-gap grids over a tinted parent, following the Hairline-Gap Rule.
- **Do** give every translucent surface an `inset 0 1px 0` near-white top edge.
- **Do** pair every `backdrop-filter` with an `@supports not` fallback plus a `prefers-reduced-transparency` opaque variant — the existing CSS does this for the header, ask panel, secondary button, chips, availability pill and ask box, and new glass must match.
- **Do** keep every control at a 44px minimum touch target below 760px.
- **Do** write the full degradation set for any new motion: `prefers-reduced-motion`, coarse-pointer, `forced-colors` and print. The rotating border is the reference implementation.
- **Do** keep the one-step-down radius shift at the 760px breakpoint when adding a new surface.
- **Do** use the `rounded` scale (13 / 20 / 26 / 32 / 38 / pill / circle) for all new work, and collapse legacy off-scale radii onto the nearest step when you touch a rule.
- **Do** use only the weights that exist on disk: Bricolage Grotesque 600 and 700, IBM Plex Sans 400, 500 and 600. Any other value triggers synthetic bolding, which coarsens the display type carrying this system. `b` and `strong` are globally set to 600 for exactly this reason — the body face has no 700.

### Don't:

- **Don't** introduce a second accent color, a decorative gradient on type, an illustration style, or a background texture. The field stays uncontaminated.
- **Don't** use Evidence Mint on a light surface, or pure `#000` anywhere outside a shadow or mask color function.
- **Don't** cast tight, dark shadows. ≥24px blur, ≤20% alpha, tinted with the surface's own hue.
- **Don't** promote a card to a higher elevation on hover. The hover vocabulary is a 2–4px translate plus a marginally deeper pool — nothing more.
- **Don't** add a second background gradient to the light field. One bloom, at 88% 6%.
- **Don't** give a control a rounded-rectangle radius; controls are pills.
- **Don't** set a 0 radius on any surface.
- **Don't** set type below 11px, or apply positive letter-spacing to anything that isn't an uppercase label at 11–13px.
- **Don't** add a third-party font, script, image host or stylesheet. The CSP forbids it and the privacy posture depends on it — new type must be self-hosted in `fonts/` and new imagery must live in the repo.
- **Don't** put more than one supporting paragraph under a heading.
- **Don't** add self-initiated motion to a fifth surface. The rotating border's scarcity across exactly four panels is what keeps it a signature instead of a tic.
