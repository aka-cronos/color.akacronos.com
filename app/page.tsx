'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { parseColor } from '@/lib/color/parse'
import { generatePalette } from '@/lib/color/generate'
import { generateDarkPalette } from '@/lib/color/darkMode'
import { generateNeutralPalette } from '@/lib/color/neutral'
import type { PaletteStep } from '@/lib/color/types'
import { ColorInput } from '@/components/ColorInput'
import { PaletteGrid } from '@/components/PaletteGrid'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

const ExportPanel = dynamic(
  () =>
    import('@/components/ExportPanel').then(mod => ({
      default: mod.ExportPanel,
    })),
  { ssr: false },
)

const DEFAULT_INPUT = '#3b82f6'
const DEFAULT_PALETTE_NAME = 'primary'

interface PaletteResult {
  steps: PaletteStep[]
  darkSteps: PaletteStep[]
  neutralSteps: PaletteStep[]
  error: string | null
}

export default function Home() {
  const [colorInput, setColorInput] = useState(DEFAULT_INPUT)
  const [paletteName, setPaletteName] = useState(DEFAULT_PALETTE_NAME)

  const { steps, darkSteps, neutralSteps, error } =
    useMemo<PaletteResult>(() => {
      const baseColor = parseColor(colorInput)
      if (!baseColor) {
        return {
          steps: [],
          darkSteps: [],
          neutralSteps: [],
          error: colorInput.trim()
            ? 'Invalid color. Use a hex code like #3b82f6 or oklch(0.6 0.22 250).'
            : null,
        }
      }
      try {
        return {
          steps: generatePalette(baseColor),
          darkSteps: generateDarkPalette(baseColor),
          neutralSteps: generateNeutralPalette(baseColor),
          error: null,
        }
      } catch {
        return {
          steps: [],
          darkSteps: [],
          neutralSteps: [],
          error: 'Failed to generate palette.',
        }
      }
    }, [colorInput])

  const hasPalette = steps.length > 0

  return (
    <div className='min-h-screen bg-zinc-50 px-4 py-12 dark:bg-zinc-950'>
      <div className='mx-auto flex max-w-5xl flex-col gap-10'>
        {/* Header */}
        <header className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50'>
            Color Palette Generator
          </h1>
          <p className='text-zinc-500 dark:text-zinc-400'>
            Generate an 11-step Tailwind-style palette in OKLCH with APCA
            contrast scores.
          </p>
        </header>

        {/* Input */}
        <div className='flex max-w-2xl flex-col gap-6 sm:flex-row'>
          <div className='flex-1'>
            <ColorInput
              value={colorInput}
              onChange={setColorInput}
              error={error}
            />
          </div>
          <div className='flex-1'>
            <Field>
              <FieldLabel htmlFor='palette-name'>Palette Name</FieldLabel>
              <Input
                id='palette-name'
                type='text'
                value={paletteName}
                onChange={e => setPaletteName(e.target.value)}
                placeholder='e.g. primary, brand, accent'
                spellCheck={false}
              />
            </Field>
          </div>
        </div>

        {/* Palettes */}
        {hasPalette ? (
          <>
            <PaletteGrid
              label={`${paletteName || 'color'} light`}
              steps={steps}
            />
            <PaletteGrid
              label={`${paletteName || 'color'} dark`}
              steps={darkSteps}
            />
            <PaletteGrid label='Neutral' steps={neutralSteps} />
            <ExportPanel
              paletteName={paletteName || 'color'}
              steps={steps}
              darkSteps={darkSteps}
              neutralSteps={neutralSteps}
            />
          </>
        ) : null}

        {/* Empty state */}
        {!hasPalette && !error ? (
          <p className='text-sm text-zinc-400 dark:text-zinc-600'>
            Enter a color above to generate a palette.
          </p>
        ) : null}
      </div>
    </div>
  )
}
