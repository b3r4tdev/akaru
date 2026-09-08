import { SearchX } from 'lucide-react'

/**
 * @param {Object} props
 * @param {import('lucide-react').LucideIcon} [props.icon]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {import('react').ReactNode} [props.action]
 */
export function EmptyState({ icon: Icon = SearchX, title, description, action }) {
  return (
    <div className="dot-grid flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-akaru-600/10 text-akaru-400">
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-bold text-white">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-zinc-400">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
