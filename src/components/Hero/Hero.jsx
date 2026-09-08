import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, Pause, Play, Plus, Check } from 'lucide-react'
import { ScoreBadge } from '@/components/ui/ScoreBadge'
import { StatusBadge } from '@/components/ui/Badge'
import { useList } from '@/context/ListContext'
import { useToast } from '@/context/ToastContext'
import { cx } from '@/utils/cx'

const AUTOPLAY_MS = 6500

export function Hero({ featured }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [paused, setPaused] = useState(false)
  const [progressKey, setProgressKey] = useState(0)
  const { statusOf, isFavorite, setListStatus, toggleFavorite } = useList()
  const { toast } = useToast()
  const timerRef = useRef(null)
  const count = featured.length

  const goTo = useCallback(
    (next) => {
      setDirection(next > index ? 1 : -1)
      setIndex(((next % count) + count) % count)
      setProgressKey((k) => k + 1)
    },
    [index, count],
  )

  const next = useCallback(() => goTo(index + 1), [goTo, index])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (paused) return
    timerRef.current = setTimeout(next, AUTOPLAY_MS)
    return () => clearTimeout(timerRef.current)
  }, [index, paused, next])

  useEffect(() => {
    const onKey = (e) => {
      if (e.target !== document.body) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  const anime = featured[index]
  const fav = isFavorite(anime.id)
  const status = statusOf(anime.id)

  const handleAdd = () => {
    setListStatus(anime.id, status === 'watching' ? null : 'watching')
    toast(
      status === 'watching' ? `${anime.title} listenden çıkarıldı` : `${anime.title} "İzliyorum" listesine eklendi`,
      'success',
    )
  }

  const handleFav = () => {
    const nowFav = toggleFavorite(anime.id)
    toast(nowFav ? `${anime.title} favorilere eklendi` : `${anime.title} favorilerden çıkarıldı`, 'info')
  }

  return (
    <section
      className="relative h-[86vh] min-h-[560px] w-full overflow-hidden bg-abyss sm:h-[82vh] lg:h-[88vh]"
      aria-roledescription="carousel"
      aria-label="Öne çıkan animeler"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={anime.id}
          custom={direction}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <img
            src={anime.banner}
            alt={`${anime.title} banner görseli`}
            className="animate-kenburns h-full w-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/45 to-night/30" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-night/90 via-night/30 to-transparent" aria-hidden="true" />
      <div className="noise absolute inset-0" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-4 pb-24 sm:px-6 sm:pb-28 lg:px-10 lg:pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={anime.id}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="max-w-2xl"
          >
            <div className="mb-4 flex flex-wrap items-center gap-2.5">
              <span className="rounded-md bg-akaru-600 px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-glow-sm">
                Öne Çıkan
              </span>
              <StatusBadge status={anime.status} className="rounded-md bg-black/50 px-2.5 py-1 backdrop-blur-md" />
              <span className="rounded-md bg-black/50 px-2.5 py-1 text-xs font-bold text-zinc-300 backdrop-blur-md">
                {anime.type} · {anime.ageRating}
              </span>
            </div>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.05] text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
              {anime.title}
            </h1>
            <p className="mt-2 text-sm font-medium tracking-wide text-zinc-400">
              {anime.japaneseTitle} · {anime.englishTitle}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2.5 text-sm font-semibold text-zinc-300">
              <ScoreBadge score={anime.score} size="md" />
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-zinc-600" aria-hidden="true" />
                {anime.year}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-zinc-600" aria-hidden="true" />
                {anime.currentEpisode ?? anime.episodes} Bölüm
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-zinc-600" aria-hidden="true" />
                {anime.studio}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {anime.genres.map((g) => (
                <Link
                  key={g}
                  to={`/animeler?tur=${encodeURIComponent(g)}`}
                  className="rounded-md border border-white/15 bg-black/40 px-2.5 py-1 text-xs font-semibold text-zinc-200 backdrop-blur-md transition-colors hover:border-akaru-400/60 hover:text-akaru-200"
                >
                  {g}
                </Link>
              ))}
            </div>

            <p className="mt-5 line-clamp-3 max-w-xl text-sm leading-relaxed text-zinc-300 sm:text-base">
              {anime.description}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={`/izle/${anime.id}/1`}
                className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-akaru-600 px-7 text-base font-bold text-white shadow-glow-sm transition-all hover:bg-akaru-500 hover:shadow-glow active:scale-95"
              >
                <Play className="h-5 w-5 fill-current transition-transform group-hover:scale-110" aria-hidden="true" />
                Animeyi İzle
              </Link>
              <button
                type="button"
                onClick={handleAdd}
                className={cx(
                  'inline-flex h-12 items-center gap-2 rounded-xl border px-6 text-base font-bold transition-all active:scale-95',
                  status === 'watching'
                    ? 'border-akaru-400/50 bg-akaru-600/15 text-akaru-200'
                    : 'glass text-white hover:border-akaru-400/40 hover:bg-white/12',
                )}
              >
                {status === 'watching' ? (
                  <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Plus className="h-5 w-5" aria-hidden="true" />
                )}
                {status === 'watching' ? 'Listemde' : 'Listeme Ekle'}
              </button>
              <button
                type="button"
                onClick={handleFav}
                aria-pressed={fav}
                aria-label="Favorilere ekle"
                className={cx(
                  'flex h-12 w-12 items-center justify-center rounded-xl border transition-all active:scale-95',
                  fav
                    ? 'border-akaru-400/50 bg-akaru-600/15 text-akaru-300'
                    : 'glass text-zinc-300 hover:text-akaru-300',
                )}
              >
                <Heart className={cx('h-5 w-5', fav && 'fill-current')} aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-6 right-4 z-10 flex items-center gap-2 sm:right-6 lg:right-10">
        <button
          type="button"
          onClick={prev}
          className="glass flex h-11 w-11 items-center justify-center rounded-full text-zinc-200 transition-all hover:border-akaru-400/50 hover:text-white active:scale-90"
          aria-label="Önceki anime"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          className="glass flex h-11 w-11 items-center justify-center rounded-full text-zinc-200 transition-all hover:border-akaru-400/50 hover:text-white active:scale-90"
          aria-label="Sonraki anime"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="absolute bottom-6 left-4 z-10 flex items-center gap-2 sm:left-6 lg:left-10">
        {featured.map((f, i) => (
          <button
            key={f.id}
            type="button"
            onClick={() => goTo(i)}
            className="group relative h-1.5 overflow-hidden rounded-full bg-white/15 transition-all hover:bg-white/25"
            style={{ width: i === index ? 56 : 20 }}
            aria-label={`${i + 1}. animeye git: ${f.title}`}
            aria-current={i === index}
          >
            {i === index && (
              <motion.span
                key={progressKey}
                className="absolute inset-y-0 left-0 rounded-full bg-akaru-500"
                initial={{ width: '0%' }}
                animate={{ width: paused ? '35%' : '100%' }}
                transition={{ duration: paused ? 0.3 : AUTOPLAY_MS / 1000, ease: 'linear' }}
              />
            )}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        className="glass absolute right-4 top-24 z-10 hidden h-10 w-10 items-center justify-center rounded-full text-zinc-300 transition-colors hover:text-white lg:flex"
        aria-label={paused ? 'Otomatik geçişi başlat' : 'Otomatik geçişi duraklat'}
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>
    </section>
  )
}
