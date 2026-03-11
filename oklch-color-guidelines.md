# OKLCH Color Space Guidelines

> Based on the **OKLCH** color model — a perceptually uniform, cylindrical color space built on top of Oklab.
> Sources: [Evil Martians: OKLCH in CSS](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl) · [MDN: oklch()](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/oklch)

---

## Why OKLCH?

| Format | Human-readable | P3 Gamut | Predictable Lightness | Hue Stability |
|--------|:-:|:-:|:-:|:-:|
| HEX/RGB | ✗ | ✗ | ✗ | — |
| HSL | Partial | ✗ | ✗ (inconsistent) | ✗ |
| LCH | ✓ | ✓ | ✓ | ✗ (blue shift 270–330°) |
| **OKLCH** | **✓** | **✓** | **✓** | **✓** |

OKLCH is the recommended color space for design systems because:

- **Perceptually uniform lightness** — `L 0.5` looks equally bright regardless of hue
- **No hue shifts** when adjusting chroma or lightness (unlike LCH's blue-range problem)
- **Wide gamut ready** — expresses colors beyond sRGB (Display P3, Rec2020)
- **Predictable manipulation** — changing one axis doesn't unexpectedly alter others
- **Baseline browser support** since May 2023 (Chrome, Safari, Firefox)

---

## CSS Syntax

```css
/* Absolute */
oklch(L C H)
oklch(L C H / A)

/* Relative (CSS Colors Level 5) */
oklch(from <color> L C H)
oklch(from <color> L C H / A)
```

---

## Channel Reference

### L — Lightness

| Value | Description |
|-------|-------------|
| `0` / `0%` | Pure black |
| `0.5` / `50%` | Mid-tone |
| `1` / `100%` | Pure white |

- Type: `<number>` (0–1) or `<percentage>` (0%–100%)
- Represents **perceived brightness** — not luminance, not HSL lightness
- **Rule of thumb:** All colors at `L ≥ 0.87` have sufficient contrast with black text

---

### C — Chroma (Saturation/Colorfulness)

| Value | Description |
|-------|-------------|
| `0` | No color (achromatic / grey) |
| `0.1` | Muted, pastel-like |
| `0.2` | Moderate saturation |
| `0.37` | Near sRGB gamut boundary (typical max for sRGB) |
| `0.4+` | P3 / wide-gamut territory |
| `~0.5` | Practical upper bound |

- Type: `<number>` (0–~0.5) or `<percentage>` (`100%` = `0.4`)
- Theoretically unbounded, but **sRGB displays cap out around 0.37**
- Values above the display's gamut are **automatically mapped** by the browser

---

### H — Hue

| Angle | Approximate Color |
|-------|------------------|
| `0°` / `360°` | Magenta / Pink |
| `20°–40°` | Red |
| `60°–90°` | Orange → Yellow |
| `90°–140°` | Yellow → Green |
| `140°–180°` | Green → Cyan |
| `180°–220°` | Cyan → Blue |
| `220°–260°` | Blue |
| `260°–320°` | Blue → Purple → Magenta |

- Type: `<number>` or `<angle>` (0–360)
- **Note:** Hue angles differ from HSL. Red ≈ `41°` in OKLCH vs. `0°` in HSL.
- Hue is **undefined** (`none`) for achromatic colors (C = 0)

---

### A — Alpha (Optional)

- Type: `<number>` (0–1) or `<percentage>` (0%–100%)
- Preceded by `/` separator
- Defaults to `1` (fully opaque) if omitted

---

## Gamut Mapping

Not every `(L, C, H)` combination is displayable on every screen. When a color is out of gamut:

1. **CSS Spec method (preferred):** Reduce chroma while preserving hue and lightness
2. **Clipping (fast but imprecise):** Convert to RGB and clip — may cause visible hue drift

Browsers are required to use the OKLCH method per the CSS spec. To **target wide-gamut displays** explicitly:

```css
/* Base: sRGB-safe color */
.element {
  background: oklch(0.65 0.2 250);
}

/* Enhanced: P3 color for supporting displays */
@media (color-gamut: p3) {
  .element {
    background: oklch(0.65 0.32 250);
  }
}
```

---

## Palette Generation Patterns

### Lightness Scale (fixed H and C)

```css
/* Same hue and chroma — only lightness changes */
--color-50:  oklch(0.97 0.02 250);
--color-100: oklch(0.93 0.04 250);
--color-200: oklch(0.85 0.08 250);
--color-300: oklch(0.75 0.12 250);
--color-400: oklch(0.65 0.18 250);
--color-500: oklch(0.55 0.22 250);  /* base */
--color-600: oklch(0.45 0.20 250);
--color-700: oklch(0.35 0.17 250);
--color-800: oklch(0.25 0.12 250);
--color-900: oklch(0.15 0.07 250);
--color-950: oklch(0.10 0.04 250);
```

> Chroma should be **tapered** at very light and very dark ends — high chroma at extreme lightness values often exceeds gamut.

### Relative Color Modifications

```css
:root { --accent: oklch(0.60 0.22 250); }

.lighter { background: oklch(from var(--accent) calc(l + 0.15) c h); }
.darker  { background: oklch(from var(--accent) calc(l - 0.15) c h); }
.muted   { background: oklch(from var(--accent) l calc(c * 0.5) h); }
.shifted { background: oklch(from var(--accent) l c calc(h + 30)); }
```

### Harmonious Color Families (Hue Rotation)

```css
/* Complementary */
--primary:      oklch(0.60 0.22 250);
--complementary: oklch(0.60 0.22 70);   /* +180° – ~yellow */

/* Triadic */
--triadic-1: oklch(0.60 0.22 250);
--triadic-2: oklch(0.60 0.22 130);     /* +120° */
--triadic-3: oklch(0.60 0.22 10);      /* +240° */

/* Analogous */
--analogous-1: oklch(0.60 0.22 220);   /* -30° */
--analogous-2: oklch(0.60 0.22 250);   /* base */
--analogous-3: oklch(0.60 0.22 280);   /* +30° */
```

---

## Dark Mode

Because OKLCH lightness is perceptually uniform, dark mode palettes can be derived by mirroring the L axis:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg:   oklch(0.15 0.02 250);
    --text: oklch(0.92 0.01 250);
  }
}
```

> Colors in the same hue family maintain visual coherence across light and dark themes when built with OKLCH.

---

## Integration with APCA

When using OKLCH for palette generation, validate text contrast using **APCA Lc values** (see `apca-contrast-guidelines.md`):

- OKLCH `L` is **not** the same as APCA's `Lc` — they are different scales
- OKLCH `L` gives perceptual uniformity for **design decisions** (palette building, UI harmony)
- APCA measures **luminance contrast between text and background** for **accessibility compliance**
- After defining colors in OKLCH, always compute APCA contrast for text pairings

| OKLCH Role | APCA Role |
|------------|-----------|
| Define palette colors | Validate text pairings |
| Ensure visual harmony | Ensure readability |
| Design tool | Accessibility tool |

---

## The `none` Keyword

`none` marks a **missing** (undefined) channel. Used primarily in color interpolation and relative color syntax:

```css
/* White has no meaningful hue — none is correct */
oklch(1 0 none)

/* Missing alpha inherits from origin color */
oklch(from var(--base) l c h)  /* alpha = origin alpha */
```

---

## Quick Reference

```
Adjust brightness only?
  → Change L, keep C and H fixed

Adjust saturation only?
  → Change C, keep L and H fixed
  → C 0 = grey, C 0.37 ≈ sRGB max, C 0.4+ = wide gamut

Shift hue, same feel?
  → Change H, keep L and C fixed

Need a tint (lighter)?
  → oklch(from base calc(l + 0.1) c h)

Need a shade (darker)?
  → oklch(from base calc(l - 0.1) c h)

Need a muted/desaturated variant?
  → oklch(from base l calc(c * 0.5) h)

Targeting wide-gamut screens?
  → Wrap high-C values in @media (color-gamut: p3)

Need dark mode?
  → Mirror L axis (e.g., 0.9 → 0.15), keep H and C consistent
```
