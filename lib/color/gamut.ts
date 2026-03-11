import { converter, toGamut, formatHex } from 'culori'
import type { OklchColor } from './types'

const toOklch = converter('oklch')
const toLrgb = converter('lrgb')

/**
 * Maps an OKLCH color into the sRGB gamut, returning the adjusted
 * OKLCH values and the hex string.
 */
export function gamutMap(oklch: OklchColor): {
  oklch: OklchColor
  hex: string
} {
  const inGamut = toGamut(
    'rgb',
    'oklch',
  )({
    mode: 'oklch',
    l: oklch.l,
    c: oklch.c,
    h: oklch.h,
  })

  const mapped = toOklch(inGamut)!
  const hex = formatHex(inGamut) ?? '#000000'

  return {
    oklch: { l: mapped.l ?? 0, c: mapped.c ?? 0, h: mapped.h ?? 0 },
    hex,
  }
}

/**
 * Compute relative luminance Y from an OKLCH color (gamut-mapped to sRGB).
 * Y = 0.2126R + 0.7152G + 0.0722B (linear light)
 */
export function oklchToY(oklch: OklchColor): number {
  const lrgb = toLrgb({ mode: 'oklch', l: oklch.l, c: oklch.c, h: oklch.h })
  if (!lrgb) return 0
  const r = lrgb.r ?? 0
  const g = lrgb.g ?? 0
  const b = lrgb.b ?? 0
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
