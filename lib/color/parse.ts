import { converter, parse } from 'culori'
import type { OklchColor } from './types'

const toOklch = converter('oklch')

/**
 * Parse a HEX string like "#3b82f6" into OklchColor.
 */
function parseHex(input: string): OklchColor | null {
  const color = parse(input)
  if (!color) return null
  const oklch = toOklch(color)
  if (!oklch) return null
  return { l: oklch.l ?? 0, c: oklch.c ?? 0, h: oklch.h ?? 0 }
}

/**
 * Parse an oklch(...) CSS string.
 * Accepts: "oklch(0.6 0.22 250)" or "oklch(0.6 0.22 250.0)"
 */
function parseOklchString(input: string): OklchColor | null {
  const match = input
    .trim()
    .match(/^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)$/i)
  if (!match) return null
  const l = parseFloat(match[1])
  const c = parseFloat(match[2])
  const h = parseFloat(match[3])
  if (isNaN(l) || isNaN(c) || isNaN(h)) return null
  if (l < 0 || l > 1) return null
  if (c < 0) return null
  return { l, c, h }
}

/**
 * Parse a user-supplied color string (HEX or oklch(...)) into OklchColor.
 * Returns null if the input is invalid.
 */
export function parseColor(input: string): OklchColor | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (trimmed.toLowerCase().startsWith('oklch(')) {
    return parseOklchString(trimmed)
  }

  // Try as hex (with or without #)
  const hexInput = trimmed.startsWith('#') ? trimmed : `#${trimmed}`
  return parseHex(hexInput)
}
