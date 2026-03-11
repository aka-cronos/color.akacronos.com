import { cn } from '@/lib/utils'
import type { PaletteStep } from '@/lib/color/types'
import { SwatchCard } from './SwatchCard'

interface PaletteGridProps {
  label: string
  steps: PaletteStep[]
  labelClassName?: string
}

export function PaletteGrid({
  label,
  steps,
  labelClassName,
}: PaletteGridProps) {
  return (
    <section className='flex flex-col gap-3'>
      <h2
        className={cn(
          'text-sm font-semibold tracking-wider uppercase',
          labelClassName ?? 'text-zinc-500 dark:text-zinc-400',
        )}
      >
        {label}
      </h2>
      <div className='grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-2'>
        {steps.map(step => (
          <SwatchCard key={step.name} step={step} />
        ))}
      </div>
    </section>
  )
}
