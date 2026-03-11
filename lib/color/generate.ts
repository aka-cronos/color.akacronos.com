import { gamutMap } from './gamut'
import { computeApca } from './apca'
import type { OklchColor, PaletteStep } from './types'

export const STEP_NAMES = [
  '50',
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
  '950',
] as const
export type StepName = (typeof STEP_NAMES)[number]

export const TARGET_L: Record<StepName, number> = {
  '50': 0.975,
  '100': 0.95,
  '200': 0.9,
  '300': 0.825,
  '400': 0.72,
  '500': 0.6,
  '600': 0.49,
  '700': 0.39,
  '800': 0.28,
  '900': 0.185,
  '950': 0.13,
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

/**
 * Compute the chroma for a given lightness level using smoothstep tapering.
 */
export function computeChroma(l: number, baseC: number): number {
  const LOW_L = 0.2
  const HIGH_L = 0.85
  const LOW_FACTOR = 0.25
  const HIGH_FACTOR = 0.15

  if (l <= LOW_L) {
    return baseC * LOW_FACTOR
  }
  if (l >= HIGH_L) {
    return baseC * HIGH_FACTOR
  }

  // In the mid range, taper smoothly toward extremes
  const midLow = 0.35 // fully ramped up from LOW_L
  const midHigh = 0.7 // starts tapering toward HIGH_L

  if (l <= midLow) {
    const t = (l - LOW_L) / (midLow - LOW_L)
    return baseC * (LOW_FACTOR + (1 - LOW_FACTOR) * smoothstep(t))
  }
  if (l >= midHigh) {
    const t = (l - midHigh) / (HIGH_L - midHigh)
    return baseC * (1 - (1 - HIGH_FACTOR) * smoothstep(t))
  }

  return baseC
}

function formatCssOklch(oklch: OklchColor): string {
  return `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(1)})`
}

function buildStep(
  name: string,
  l: number,
  baseC: number,
  baseH: number,
  isBase: boolean,
): PaletteStep {
  const c = computeChroma(l, baseC)
  const { oklch, hex } = gamutMap({ l, c, h: baseH })
  const apca = computeApca(oklch)
  return {
    name,
    oklch,
    hex,
    cssOklch: formatCssOklch(oklch),
    apca,
    isBase,
  }
}

/**
 * Generate an 11-step OKLCH palette from a base color.
 * If the base color's lightness doesn't map to an existing step (±0.03),
 * an extra "base" step is inserted at the correct sorted position.
 */
export function generatePalette(baseColor: OklchColor): PaletteStep[] {
  const steps: PaletteStep[] = STEP_NAMES.map(name =>
    buildStep(name, TARGET_L[name], baseColor.c, baseColor.h, false),
  )

  // Check if base L is already represented
  const baseL = baseColor.l
  const isRepresented = STEP_NAMES.some(
    name => Math.abs(TARGET_L[name] - baseL) <= 0.03,
  )

  if (!isRepresented) {
    const baseStep = buildStep('base', baseL, baseColor.c, baseColor.h, true)
    // Insert sorted by descending lightness (same order as 50→950)
    const insertAt = steps.findIndex(s => s.oklch.l < baseL)
    if (insertAt === -1) {
      steps.push(baseStep)
    } else {
      steps.splice(insertAt, 0, baseStep)
    }
  }

  return steps
}
