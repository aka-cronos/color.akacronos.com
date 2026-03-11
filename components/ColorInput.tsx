'use client'

import { useState, useEffect, useRef } from 'react'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { parseColor } from '@/lib/color'

interface ColorInputProps {
  value: string
  onChange: (value: string) => void
  error?: string | null
}

export function ColorInput({ value, onChange, error }: ColorInputProps) {
  const [draft, setDraft] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync draft when external value changes (e.g. initial)
  useEffect(() => {
    setDraft(value)
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value
    setDraft(raw)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => onChange(raw), 300)
  }

  const parsedColor = parseColor(draft)
  const swatchColor = parsedColor
    ? `oklch(${parsedColor.l} ${parsedColor.c} ${parsedColor.h})`
    : 'transparent'

  return (
    <Field data-invalid={!!error}>
      <FieldLabel htmlFor='color-input'>Base Color</FieldLabel>
      <div className='flex items-start gap-4'>
        <div
          className='h-16 w-16 shrink-0 rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800'
          style={{ backgroundColor: swatchColor }}
        />
        <div className='flex flex-1 flex-col gap-2'>
          <Input
            id='color-input'
            type='text'
            value={draft}
            onChange={handleChange}
            placeholder='#3b82f6 or oklch(0.6 0.22 250)'
            spellCheck={false}
            aria-invalid={!!error}
            className='font-mono'
          />
          <div className='flex gap-4 font-mono text-xs text-zinc-500 dark:text-zinc-400'>
            {parsedColor ? (
              <>
                <span>L: {parsedColor.l.toFixed(2)}</span>
                <span>C: {parsedColor.c.toFixed(3)}</span>
                <span>H: {Math.round(parsedColor.h)}&deg;</span>
              </>
            ) : (
              <span>Invalid color</span>
            )}
          </div>
        </div>
      </div>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  )
}
