import { cx } from '@/utils/cx'

export function LogoMark({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="AKARU logosu">
      <defs>
        <linearGradient id="akaru-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5c7c" />
          <stop offset="1" stopColor="#c40c34" />
        </linearGradient>
      </defs>
      <path
        d="M24 6 42 24 24 42 6 24Z"
        fill="none"
        stroke="url(#akaru-mark)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 30.5 24 15l7.5 15.5M19 26.5h10"
        fill="none"
        stroke="url(#akaru-mark)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({ compact = false, className = '' }) {
  return (
    <span className={cx('inline-flex items-center gap-2.5', className)}>
      <LogoMark className="h-9 w-9 shrink-0 drop-shadow-[0_0_12px_rgba(249,46,86,0.45)]" />
      {!compact && (
        <span className="text-xl font-extrabold tracking-[0.28em] text-white">
          AKARU
        </span>
      )}
    </span>
  )
}
