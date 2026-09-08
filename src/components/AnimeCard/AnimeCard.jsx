import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Heart, Play, Plus } from 'lucide-react'
import { ScoreBadge } from '@/components/ui/ScoreBadge'
import { useList } from '@/context/ListContext'
import { useToast } from '@/context/ToastContext'
import { cx } from '@/utils/cx'

/**
 * @param {Object} props
 * @param {Object} props.anime
 * @param {string} [props.episodeBadge] - Kartın köşesinde gösterilecek bölüm etiketi
 * @param {number} [props.index]
 */
export function AnimeCard({ anime, episodeBadge, index = 0 }) {
  const { statusOf, isFavorite, setListStatus, toggleFavorite } = useList()
  const { toast } = useToast()
  const fav = isFavorite(anime.id)
  const status = statusOf(anime.id)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setListStatus(anime.id, status === 'watching' ? null : 'watching')
    toast(
      status === 'watching' ? `${anime.title} listenden çıkarıldı` : `${anime.title} "İzliyorum" listesine eklendi`,
      'success',
    )
  }

  const handleQuickFav = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const nowFav = toggleFavorite(anime.id)
    toast(nowFav ? `${anime.title} favorilere eklendi` : `${anime.title} favorilerden çıkarıldı`, 'info')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.3) }}
      className="group"
    >
      <Link to={`/anime/${anime.id}`} className="block" aria-label={`${anime.title} detayına git`}>
        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-elevate shadow-card transition-shadow duration-300 group-hover:shadow-card-hover">
          <img
            src={anime.poster}
            alt={`${anime.title} posteri`}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />

          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden="true"
          />

          <div className="absolute left-2.5 top-2.5 flex gap-1.5">
            {episodeBadge && (
              <span className="rounded-md bg-akaru-600 px-2 py-0.5 text-[11px] font-extrabold text-white shadow-glow-sm">
                {episodeBadge}
              </span>
            )}
            <span className="rounded-md bg-black/65 px-2 py-0.5 text-[11px] font-bold text-zinc-200 backdrop-blur-md">
              {anime.type}
            </span>
          </div>

          <div className="absolute right-2.5 top-2.5 flex translate-y-1 flex-col gap-1.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleQuickAdd}
              className={cx(
                'flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition-colors',
                status === 'watching'
                  ? 'bg-akaru-600 text-white'
                  : 'bg-black/60 text-zinc-200 hover:bg-akaru-600 hover:text-white',
              )}
              aria-label={status === 'watching' ? 'Listemden çıkar' : 'Listeme ekle'}
            >
              {status === 'watching' ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={handleQuickFav}
              className={cx(
                'flex h-8 w-8 items-center justify-center rounded-lg backdrop-blur-md transition-colors',
                fav ? 'bg-akaru-600 text-white' : 'bg-black/60 text-zinc-200 hover:bg-akaru-600 hover:text-white',
              )}
              aria-label="Favorilere ekle"
              aria-pressed={fav}
            >
              <Heart className={cx('h-4 w-4', fav && 'fill-current')} />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 translate-y-2 p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="mb-2.5 flex flex-wrap gap-1">
              {anime.genres.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-200 backdrop-blur-sm"
                >
                  {g}
                </span>
              ))}
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-akaru-600 text-white shadow-glow-sm">
              <Play className="ml-0.5 h-[18px] w-[18px] fill-current" />
            </span>
          </div>
        </div>

        <div className="mt-2.5 px-0.5">
          <h3 className="truncate text-sm font-bold text-white transition-colors group-hover:text-akaru-300">
            {anime.title}
          </h3>
          <div className="mt-1 flex items-center gap-2">
            <ScoreBadge score={anime.score} size="sm" />
            <span className="truncate text-xs text-zinc-500">
              {anime.year} · {anime.currentEpisode ?? anime.episodes} Bölüm · {anime.genres[0]}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
