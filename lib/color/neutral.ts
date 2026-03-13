import { STEP_NAMES, TARGET_L, computeChroma } from './generate'
import { gamutMap, formatCssOklch } from './gamut'
import { computeApca } from './apca'
import type { OklchColor, PaletteStep } from './types'

const NEUTRAL_CHROMA_FACTOR = 0.12

export function generateNeutralPalette(baseColor: OklchColor): PaletteStep[] {
  const neutralBaseC = baseColor.c * NEUTRAL_CHROMA_FACTOR
  return STEP_NAMES.map(name => {
    const l = TARGET_L[name]
    const c = computeChroma(l, neutralBaseC)
    const { oklch: mappedOklch, hex } = gamutMap({ l, c, h: baseColor.h })
    const oklch: OklchColor = { ...mappedOklch, h: baseColor.h }
    const apca = computeApca(oklch)
    return {
      name,
      oklch,
      hex,
      cssOklch: formatCssOklch(oklch),
      apca,
      isBase: false,
    }
  })
}

export function generateNeutralDarkPalette(
  baseColor: OklchColor,
): PaletteStep[] {
  const neutralBaseC = baseColor.c * NEUTRAL_CHROMA_FACTOR
  return STEP_NAMES.map(name => {
    const darkL = 1 - TARGET_L[name]
    const c = computeChroma(darkL, neutralBaseC)
    const { oklch: mappedOklch, hex } = gamutMap({
      l: darkL,
      c,
      h: baseColor.h,
    })
    const oklch: OklchColor = { ...mappedOklch, h: baseColor.h }
    const apca = computeApca(oklch)
    return {
      name,
      oklch,
      hex,
      cssOklch: formatCssOklch(oklch),
      apca,
      isBase: false,
    }
  })
}
