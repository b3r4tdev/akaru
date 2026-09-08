import { Star } from 'lucide-react'
import { cx } from '@/utils/cx'

export function ScoreBadge({ score, size = 'md', className = '' }) {
  const sizes = {
    sm: 'text-xs px-1.5 py-0.5 gap-1',
    md: 'text-sm px-2 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  }
  const iconSizes = { sm: 'h-3 w-3', md: 'h-3.5 w-3.5', lg: 'h-4 w-4' }
  const tone =
    score >= 8.5
      ? 'text-amber-300 bg-amber-400/10 border-amber-400/20'
      : score >= 7.5
        ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20'
        : 'text-zinc-300 bg-white/8 border-white/10'

  return (
    <span
      className={cx(
        'inline-flex items-center rounded-md border font-bold',
        sizes[size],
        tone,
        className,
      )}
    >
      <Star className={cx(iconSizes[size], 'fill-current')} aria-hidden="true" />
      {score.toFixed(1)}
    </span>
  )
}
