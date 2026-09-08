import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, Tv } from 'lucide-react'
import { PageShell } from '@/components/ui/PageShell'
import { EmptyState } from '@/components/ui/EmptyState'
import { ScoreBadge } from '@/components/ui/ScoreBadge'
import { WEEKDAYS, getSchedule, todayWeekday } from '@/data/episodes'
import { withArt } from '@/data/animeData'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cx } from '@/utils/cx'

export default function CalendarPage() {
  usePageTitle('Yayın Takvimi')
  const schedule = useMemo(() => getSchedule(), [])
  const today = todayWeekday()
  const [selected, setSelected] = useState(today)

  const dayItems = schedule.get(selected) || []

  return (
    <PageShell className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-10">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-akaru-600/15 text-akaru-400">
            <CalendarDays className="h-6 w-6" aria-hidden="true" />
          </span>
          Yayın Takvimi
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Bu hafta hangi anime hangi gün yayınlanıyor? Yeni bölümleri kaçırma.
        </p>
      </div>

      <div
        className="scroll-row mb-8 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Günler"
      >
        {WEEKDAYS.map((day) => {
          const count = schedule.get(day)?.length || 0
          const isToday = day === today
          const isSelected = day === selected
          return (
            <button
              key={day}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelected(day)}
              className={cx(
                'group relative flex shrink-0 flex-col items-start gap-0.5 rounded-2xl border px-5 py-3.5 transition-all',
                isSelected
                  ? 'border-akaru-500/50 bg-akaru-600/15 shadow-glow-sm'
                  : 'border-white/[0.06] bg-panel hover:border-akaru-500/30',
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className={cx(
                    'text-sm font-extrabold',
                    isSelected ? 'text-akaru-200' : 'text-zinc-200',
                  )}
                >
                  {day}
                </span>
                {isToday && (
                  <span className="rounded-full bg-akaru-600 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-white">
                    Bugün
                  </span>
                )}
              </span>
              <span className="text-xs font-medium text-zinc-500">{count} anime</span>
            </button>
          )
        })}
      </div>

      {dayItems.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title={`${selected} günü için program yok`}
          description="Bu gün yayınlanacak bir anime bulunmuyor. Diğer günleri inceleyebilirsin."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {dayItems.map(({ anime, time, nextEpisode }, i) => {
            const art = withArt(anime)
            return (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <Link
                  to={`/anime/${anime.id}`}
                  className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-panel p-4 transition-all hover:border-akaru-500/40 hover:shadow-card"
                >
                  <div className="relative shrink-0">
                    <img
                      src={art.poster}
                      alt=""
                      loading="lazy"
                      className="h-24 w-16 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="absolute -right-2 -top-2 rounded-lg bg-akaru-600 px-2 py-0.5 text-[11px] font-extrabold text-white shadow-glow-sm">
                      B.{nextEpisode}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-400">
                      <Clock className="h-3.5 w-3.5 text-akaru-400" aria-hidden="true" />
                      {time}
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Tv className="h-3.5 w-3.5" aria-hidden="true" />
                        {anime.type}
                      </span>
                    </div>
                    <h3 className="mt-1.5 truncate text-base font-extrabold text-white transition-colors group-hover:text-akaru-300">
                      {anime.title}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-zinc-500">
                      {anime.genres.slice(0, 3).join(' · ')}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <ScoreBadge score={anime.score} size="sm" />
                      <span className="text-xs font-medium text-zinc-500">
                        {anime.currentEpisode ?? anime.episodes} bölüm yayınlandı
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      )}
    </PageShell>
  )
}
