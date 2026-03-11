import { STEP_NAMES, TARGET_L, computeChroma } from './generate'
import { gamutMap } from './gamut'
import { computeApca } from './apca'
import type { OklchColor, PaletteStep } from './types'

function formatCssOklch(oklch: OklchColor): string {
  return `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${oklch.h.toFixed(1)})`
}

/**
 * Generate the dark-mode mirror palette.
 * Each step's lightness is mirrored: darkL = 1 - TARGET_L[step]
 */
export function generateDarkPalette(baseColor: OklchColor): PaletteStep[] {
  return STEP_NAMES.map(name => {
    const darkL = 1 - TARGET_L[name]
    const c = computeChroma(darkL, baseColor.c)
    const { oklch, hex } = gamutMap({ l: darkL, c, h: baseColor.h })
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
