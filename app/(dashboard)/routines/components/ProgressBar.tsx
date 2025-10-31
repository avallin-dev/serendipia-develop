'use client'

import { usePlanProgress } from '@/app/services/queries/plan'

export default function ProgressBar({ idPlan }: { idPlan?: number }) {
  const { data } = usePlanProgress(idPlan)
  const percentage = data?.porcentajeProgreso
  const r = 30
  const circ = 2 * Math.PI * r
  const cleanPercentage = (percentage: number) => {
    const isNegativeOrNaN = !Number.isFinite(+percentage) || percentage < 0
    const isTooHigh = percentage > 100
    return isNegativeOrNaN ? 0 : isTooHigh ? 100 : +percentage
  }
  const pct = cleanPercentage(percentage!)
  const strokePct = ((100 - percentage!) * circ) / 100
  return (
    <div className="relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
      <svg className="h-20 w-20 bg-circle">
        <defs>
          <linearGradient id="grad1">
            <stop offset="0%" style={{ stopColor: '#ff00ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFFF00', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        <circle
          className="stroke-current text-gray-100"
          strokeWidth="9"
          fill="transparent"
          r="30"
          cx="40"
          cy="40"
        />
        <circle
          className="stroke-[url(#grad1)] transition-all "
          strokeWidth="9"
          strokeDasharray={circ}
          strokeDashoffset={pct ? strokePct : 0}
          strokeLinecap="round"
          fill="transparent"
          r="30"
          cx="40"
          cy="40"
        />
      </svg>
      <div className="absolute left-1/2 top-1/2 h-[45px] w-[45px] -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-white shadow-circle"></div>
      <span className="absolute">{pct ? pct + '%' : '0%'}</span>
    </div>
  )
}
