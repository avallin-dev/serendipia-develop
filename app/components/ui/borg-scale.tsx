'use client'

import { $Enums } from '@prisma/client'

import { cn } from '@/lib/utils'

interface BorgScaleProps {
  value?: $Enums.borg
  onChange?: (value: $Enums.borg) => void
  className?: string
}

const borgLevels: Array<{
  value: $Enums.borg
  label: string
  color: string
}> = [
  { value: 'ZERO', label: '0 - Reposo', color: 'bg-cyan-100' },
  { value: 'ONE', label: '1 - Muy, muy suave', color: 'bg-cyan-200' },
  { value: 'TWO', label: '2 - Muy suave', color: 'bg-cyan-300' },
  { value: 'THREE', label: '3 - Suave', color: 'bg-green-400' },
  { value: 'FOUR', label: '4 - Algo pesado', color: 'bg-green-500' },
  { value: 'FIVE', label: '5 - Pesado', color: 'bg-yellow-300' },
  { value: 'SIX', label: '6 - Más pesado', color: 'bg-yellow-400' },
  { value: 'SEVEN', label: '7 - Muy pesado', color: 'bg-orange-400' },
  { value: 'EIGHT', label: '8 - Muy, muy pesado', color: 'bg-orange-500' },
  { value: 'NINE', label: '9 - Máximo', color: 'bg-red-500' },
  { value: 'TEN', label: '10 - Extremo', color: 'bg-red-600' },
]

export function BorgScale({ value, onChange, className }: BorgScaleProps) {
  return (
    <div className={cn('grid gap-2', className)}>
      {borgLevels.map((level) => (
        <button
          type="button"
          key={level.value}
          onClick={() => onChange?.(level.value)}
          className={cn(
            'relative flex w-full items-center justify-between rounded-lg px-4 py-2 text-sm font-medium transition-all',
            level.color,
            value === level.value
              ? 'scale-[1.05] shadow-md outline -outline-offset-2 outline-blue-800'
              : 'hover:scale-[1.01] hover:opacity-90'
          )}
        >
          <span>{level.label}</span>
        </button>
      ))}
    </div>
  )
}
