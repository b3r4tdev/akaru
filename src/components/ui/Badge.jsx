import { Link } from 'react-router-dom'
import { cx } from '@/utils/cx'

const STATUS_DOT = {
  'Devam Ediyor': 'bg-emerald-400',
  Tamamlandı: 'bg-sky-400',
  'Yakında': 'bg-amber-400',
}

export function Badge({ children, className = '', tone = 'default' }) {
  const tones = {
    default: 'bg-white/8 text-zinc-300 border-white/10',
    red: 'bg-akaru-600/15 text-akaru-300 border-akaru-500/30',
    dark: 'bg-black/60 text-zinc-200 border-white/10 backdrop-blur-md',
  }
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status, className = '' }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300',
        className,
      )}
    >
      <span className={cx('h-1.5 w-1.5 rounded-full', STATUS_DOT[status] || 'bg-zinc-400')} aria-hidden="true" />
      {status}
    </span>
  )
}

export function GenreBadge({ children, to, className = '' }) {
  const cls = cx(
    'inline-block rounded-md bg-white/8 px-2 py-0.5 text-[11px] font-medium text-zinc-300 transition-colors hover:bg-akaru-600/20 hover:text-akaru-200',
    className,
  )
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return <span className={cls}>{children}</span>
}
