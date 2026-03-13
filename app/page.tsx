'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { parseColor } from '@/lib/color/parse'
import { generatePalette } from '@/lib/color/generate'
import { generateDarkPalette } from '@/lib/color/darkMode'
import {
  generateNeutralPalette,
  generateNeutralDarkPalette,
} from '@/lib/color/neutral'
import type { PaletteStep } from '@/lib/color/types'
import { ColorInput } from '@/components/ColorInput'
import { PaletteGrid } from '@/components/PaletteGrid'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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
  neutralDarkSteps: PaletteStep[]
  error: string | null
}

export default function Home() {
  const [colorInput, setColorInput] = useState(DEFAULT_INPUT)
  const [paletteName, setPaletteName] = useState(DEFAULT_PALETTE_NAME)
  const [exportOpen, setExportOpen] = useState(false)

  const { steps, darkSteps, neutralSteps, neutralDarkSteps, error } =
    useMemo<PaletteResult>(() => {
      const baseColor = parseColor(colorInput)
      if (!baseColor) {
        return {
          steps: [],
          darkSteps: [],
          neutralSteps: [],
          neutralDarkSteps: [],
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
          neutralDarkSteps: generateNeutralDarkPalette(baseColor),
          error: null,
        }
      } catch {
        return {
          steps: [],
          darkSteps: [],
          neutralSteps: [],
          neutralDarkSteps: [],
          error: 'Failed to generate palette.',
        }
      }
    }, [colorInput])

  const hasPalette = steps.length > 0
  const name = paletteName || 'color'

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
        <div className='flex max-w-2xl flex-col gap-3'>
          <div className='flex items-end justify-between gap-3'>
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
            <Button
              variant='outline'
              onClick={() => setExportOpen(true)}
              disabled={!hasPalette}
            >
              Export
            </Button>
          </div>
          <ColorInput
            value={colorInput}
            onChange={setColorInput}
            error={error}
          />
        </div>

        {/* Palettes */}
        {hasPalette ? (
          <div className='flex flex-col gap-6'>
            {/* Light card */}
            <div className='flex flex-col gap-6 rounded-2xl bg-white p-6 ring-1 ring-black/5 dark:bg-zinc-900'>
              <PaletteGrid label={`${name} · light`} steps={steps} />
              <PaletteGrid label='neutral · light' steps={neutralSteps} />
            </div>

            {/* Dark card */}
            <div className='flex flex-col gap-6 rounded-2xl bg-zinc-900 p-6 ring-1 ring-white/10'>
              <PaletteGrid
                label={`${name} · dark`}
                steps={darkSteps}
                labelClassName='text-zinc-400'
              />
              <PaletteGrid
                label='neutral · dark'
                steps={neutralDarkSteps}
                labelClassName='text-zinc-400'
              />
            </div>
          </div>
        ) : null}

        {/* Empty state */}
        {!hasPalette && !error ? (
          <p className='text-sm text-zinc-400 dark:text-zinc-600'>
            Enter a color above to generate a palette.
          </p>
        ) : null}
      </div>

      {/* Export Modal */}
      <Dialog open={exportOpen} onOpenChange={setExportOpen}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Export</DialogTitle>
          </DialogHeader>
          <ExportPanel
            paletteName={name}
            steps={steps}
            darkSteps={darkSteps}
            neutralSteps={neutralSteps}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
