import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Eye, Play, Star } from 'lucide-react'
import { formatShortDate, formatViews } from '@/utils/formatters'

export function EpisodeCard({ anime, episode, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 32 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.35) }}
      className="group w-60 shrink-0 snap-start sm:w-72"
    >
      <Link to={`/izle/${anime.id}/${episode.number}`} aria-label={`${anime.title} ${episode.number}. bölümü izle`}>
        <div className="relative aspect-video overflow-hidden rounded-xl bg-elevate shadow-card transition-shadow duration-300 group-hover:shadow-card-hover">
          <img
            src={anime.banner}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent"
            aria-hidden="true"
          />

          <span className="absolute left-2.5 top-2.5 rounded-md bg-akaru-600 px-2 py-0.5 text-[11px] font-extrabold text-white shadow-glow-sm">
            Bölüm {episode.number}
          </span>
          <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-bold text-zinc-200 backdrop-blur-md">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {formatViews(episode.views)}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="truncate text-sm font-bold text-white">{anime.title}</p>
            <p className="mt-0.5 truncate text-xs text-zinc-300">{episode.title}</p>
          </div>

          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
            <span className="flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-akaru-600 text-white shadow-glow transition-transform duration-300 group-hover:scale-100">
              <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex items-center justify-between gap-2 px-0.5">
          <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {formatShortDate(episode.airDate)}
          </span>
          <span className="flex items-center gap-1 text-xs font-bold text-amber-300">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            {anime.score.toFixed(1)}
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
