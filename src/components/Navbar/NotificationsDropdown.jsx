import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Check, Heart, Sparkles } from 'lucide-react'
import { getNotifications } from '@/data/notifications'
import { getAnimeById, withArt } from '@/data/animeData'
import { relativeTime } from '@/utils/formatters'

const TYPE_ICONS = {
  episode: { icon: Sparkles, cls: 'text-sky-400 bg-sky-400/10' },
  favorite: { icon: Heart, cls: 'text-akaru-400 bg-akaru-600/10' },
  season: { icon: CalendarDays, cls: 'text-emerald-400 bg-emerald-400/10' },
}

export function NotificationsDropdown({ onClose }) {
  const notifications = getNotifications()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className="glass-strong absolute right-0 top-full z-50 mt-2 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl shadow-card"
      role="dialog"
      aria-label="Bildirimler"
    >
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <h3 className="text-sm font-bold text-white">Bildirimler</h3>
        <span className="rounded-full bg-akaru-600/15 px-2 py-0.5 text-[11px] font-bold text-akaru-300">
          {notifications.length} yeni
        </span>
      </div>
      <div className="max-h-[22rem] overflow-y-auto">
        {notifications.map((n, i) => {
          const meta = TYPE_ICONS[n.type] || TYPE_ICONS.episode
          const Icon = meta.icon
          const anime = getAnimeById(n.animeId)
          return (
            <Link
              key={n.id}
              to={anime ? `/anime/${anime.id}` : '/'}
              onClick={onClose}
              className={i > 0 ? 'flex gap-3 border-t border-white/5 px-4 py-3 transition-colors hover:bg-white/5' : 'flex gap-3 px-4 py-3 transition-colors hover:bg-white/5'}
            >
              {anime && (
                <img
                  src={withArt(anime).poster}
                  alt=""
                  className="h-12 w-9 shrink-0 rounded-md object-cover"
                  loading="lazy"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-zinc-100">{n.title}</p>
                <p className="mt-0.5 truncate text-xs text-zinc-500">{n.detail}</p>
                <p className="mt-1 text-[11px] font-medium text-zinc-600">{relativeTime(n.time)}</p>
              </div>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${meta.cls}`}>
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          )
        })}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="flex w-full items-center justify-center gap-2 border-t border-white/8 py-2.5 text-xs font-bold text-zinc-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        <Check className="h-3.5 w-3.5" aria-hidden="true" />
        Tümünü okundu işaretle
      </button>
    </motion.div>
  )
}
