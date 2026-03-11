# APCA Contrast & Color Accessibility Guidelines

> Based on the **Accessible Perceptual Contrast Algorithm (APCA)** — the new perceptual model replacing WCAG 2.x contrast ratios.
> Source: [ARC Visual Readability Contrast](https://readtech.org/ARC/tests/visual-readability-contrast/)

---

## Core Principle

> "At least **ten times more contrast** is needed for good readability than the bare minimum needed for legibility."

APCA measures **luminance contrast (Lc)** — the perceived lightness/darkness difference between text and background — rather than the simple ratio used in WCAG 2.x. Contrast perception depends on:

- Lightness/darkness difference between text and background
- Font **weight** (stroke thickness)
- Font **size**
- Line and letter spacing
- Text **polarity** (dark-on-light vs. light-on-dark)

---

## Lc Values Reference

APCA expresses contrast as **Lc values** (0–106 scale). Light text on dark backgrounds produces **negative** values; use the **absolute value** when consulting lookup tables.

| Lc Value  | Use Case                                                   |
| --------- | ---------------------------------------------------------- |
| **Lc 90** | Preferred for body text; maximum readability               |
| **Lc 75** | Minimum for body/fluent text (Bronze)                      |
| **Lc 60** | General content 16px+; large text at lower weights         |
| **Lc 45** | Large fluent text 32px+; sub-fluent content (Gold)         |
| **Lc 30** | Non-fluent text (Gold); placeholder/disabled (limited use) |
| **Lc 15** | Logo/brand reduction allowance (from base minimum)         |

### Font Size × Weight Examples (Reference Fonts: Helvetica / Arial)

| Size | Weight | Minimum Lc |
| ---- | ------ | ---------- |
| 16px | 400    | Lc 90      |
| 18px | 400    | Lc 75      |
| 24px | 400    | Lc 60      |
| 36px | 400    | Lc 45      |

> Larger fonts at heavier weights allow lower Lc; smaller/lighter fonts demand higher Lc.

---

## Text Use Case Categories

| Category       | Definition                                                 | Examples                                                      |
| -------------- | ---------------------------------------------------------- | ------------------------------------------------------------- |
| **Fluent**     | 2+ continuous lines of text; primary reading content       | Body copy, headlines, captions, navigation                    |
| **Sub-Fluent** | Secondary/ancillary content with reduced readability needs | Bylines, secondary nav, callouts, labels                      |
| **Non-Fluent** | Non-content or incidental text                             | Placeholders, disabled controls, logos, image text, copyright |

---

## Conformance Levels

### 🥉 Bronze

**Scope:** Primary content text only — simplest to implement, no lookup tables required.

| Content Type          | Minimum Lc | Preferred Lc |
| --------------------- | ---------- | ------------ |
| Body text (fluent)    | **Lc 75**  | Lc 90        |
| Other content (16px+) | **Lc 60**  | —            |
| Large fluent (32px+)  | **Lc 45**  | —            |

- No minimum font size enforced
- No font-matching to reference fonts required
- No Exchange Rules required

---

### 🥈 Silver

**Scope:** All text content, including secondary and non-fluent text.

| Content Type      | Minimum Size | Notes                                   |
| ----------------- | ------------ | --------------------------------------- |
| Content fonts     | 13px         | Must be qualified or prequalified       |
| Non-content fonts | 10px         | —                                       |
| Logo text         | —            | Lc minimum reduced by 15 (floor: Lc 40) |

- Uses **font lookup tables** (size + weight pairs)
- Fonts must be qualified against reference fonts (Helvetica Neue, Arial, Fira Sans, Kanit)
- **Exchange Rules: choose at least 1** (see below)

---

### 🥇 Gold

**Scope:** All text, with the strictest requirements.

| Content Type      | Minimum Size | Notes                                |
| ----------------- | ------------ | ------------------------------------ |
| Content fonts     | 18px         | Fluent fonts must be qualified       |
| Non-content fonts | 12px         | —                                    |
| Sub-fluent text   | —            | Minimum Lc 45                        |
| Non-fluent text   | —            | Minimum Lc 30                        |
| Logos             | —            | Minimum Lc 45 (no further reduction) |

- Uses lookup tables with stricter minimums
- **Exchange Rules: choose at least 2** (see below)

---

## Exchange Rules (Accessibility Enhancements)

Implementing Exchange Rules allows a reduction in base contrast requirements at Silver/Gold levels.

| #   | Rule                                                                                         |
| --- | -------------------------------------------------------------------------------------------- |
| 1   | Multiple color schemes with persistent **user-controlled** selection (e.g., light/dark mode) |
| 2   | Light mode body text following **Paper Reading Experience** guidelines                       |
| 3   | **Proportional text zoom** polyfill                                                          |
| 4   | User controls for body-text **weight, size, and spacing**                                    |
| 5   | **Hyper-legible fallback fonts** available for user activation                               |

---

## Testing Methodology

### 4-Step Process

1. **Choose conformance level** — Bronze, Silver, or Gold
2. **Identify text use cases** — classify every text element as Fluent, Sub-Fluent, or Non-Fluent
3. **Obtain color values** — from CSS, design tokens, or eyedropper sampling in sRGB
4. **Calculate and evaluate** — use an APCA-W3 compliant contrast calculator

### Sampling Notes

- Color space: **sRGB** (mandatory for web)
- For transparent layers: calculate the **final composited color** (alpha-composited), then measure
- For small/antialiased text with eyedropper: sample **3–5 different letters** and average

### Standard Test Environment

| Parameter         | Value                |
| ----------------- | -------------------- |
| Display           | sRGB LCD, 72–112 ppi |
| Peak white        | 140–220 cd/m²        |
| Ambient light     | ~350 lux             |
| Observer distance | 24"–37" (60–90 cm)   |

---

## Font Qualification (Silver & Gold Only)

Non-standard fonts must establish equivalency to a **reference font** (Helvetica Neue, Arial, Fira Sans, or Kanit) via two offsets:

- **Size offset** — measure x-height at 100px: `reference x-height ÷ test font x-height`
- **Weight offset** — visually compare stroke widths at both low and high contrast, then calculate the weight delta

These offsets adjust which lookup table row/column applies to the custom font.

---

## Color Vision & Accessibility Notes

- Rely on **luminance contrast**, not hue or saturation — color alone never satisfies contrast requirements
- Contrast perception varies across **age** and **visual impairments** (low vision, color blindness, cognitive disabilities)
- APCA applies across **desktop, tablet, and mobile** screen types
- Negative Lc values (light-on-dark) are treated as their **absolute value** in all tables

---

## Quick Decision Guide

```
Is it body/paragraph text?
  → Use Lc 90 (preferred) / Lc 75 (minimum)

Is it a headline or large text (32px+)?
  → Use Lc 45 minimum

Is it a UI label, nav item, or caption (16px+)?
  → Use Lc 60 minimum

Is it a placeholder, disabled, or logo?
  → Use Lc 30–45 (non-fluent, Gold) or Lc 15 reduction from base (Silver)

Need deepest compliance?
  → Gold + 2 Exchange Rules
```
