import { Link } from 'react-router-dom'
import { cx } from '@/utils/cx'

const VARIANTS = {
  primary:
    'bg-akaru-600 text-white hover:bg-akaru-500 shadow-glow-sm hover:shadow-glow active:scale-[0.98]',
  secondary:
    'glass text-white hover:bg-white/12 hover:border-akaru-400/40 active:scale-[0.98]',
  outline:
    'border border-white/15 text-zinc-200 hover:border-akaru-400/60 hover:text-white hover:bg-white/5 active:scale-[0.98]',
  ghost: 'text-zinc-300 hover:text-white hover:bg-white/8 active:scale-[0.98]',
}

const SIZES = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-7 text-base gap-2.5 rounded-xl',
}

/**
 * @param {{
 *   [key: string]: any,
 *   children?: import('react').ReactNode,
 *   variant?: 'primary'|'secondary'|'outline'|'ghost',
 *   size?: 'sm'|'md'|'lg',
 *   to?: string,
 *   href?: string,
 *   className?: string,
 * }} props
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  ...props
}) {
  const classes = cx(
    'inline-flex items-center justify-center font-semibold transition-all duration-200 select-none cursor-pointer',
    VARIANTS[variant],
    SIZES[size],
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
