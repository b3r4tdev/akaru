import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cx } from '@/utils/cx'

/**
 * @param {Object} props
 * @param {import('lucide-react').LucideIcon} [props.icon]
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {string} [props.linkTo]
 * @param {string} [props.linkLabel]
 * @param {string} [props.className]
 */
export function SectionHeader({ icon: Icon, title, subtitle, linkTo, linkLabel = 'Tümünü Gör', className = '' }) {
  return (
    <div className={cx('mb-6 flex items-end justify-between gap-4', className)}>
      <div>
        <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-white sm:text-2xl">
          {Icon && (
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-akaru-600/15 text-akaru-400">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          )}
          {title}
        </h2>
        {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-zinc-400 transition-colors hover:text-akaru-300"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}
