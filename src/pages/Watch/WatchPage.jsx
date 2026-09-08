import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Eye, ListVideo, Search, Star } from 'lucide-react'
import { VideoPlayer } from '@/components/Player/VideoPlayer'
import { PageShell } from '@/components/ui/PageShell'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'
import { getAnimeById, withArt } from '@/data/animeData'
import { getEpisodes, getSeasons } from '@/data/episodes'
import { useList } from '@/context/ListContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDate, formatViews } from '@/utils/formatters'
import { cx } from '@/utils/cx'

export default function WatchPage() {
  const { animeId, ep } = useParams()
  const navigate = useNavigate()
  const raw = getAnimeById(animeId)
  const anime = useMemo(() => (raw ? withArt(raw) : null), [raw])

  const episodes = useMemo(() => (anime ? getEpisodes(anime) : []), [anime])
  const episode = useMemo(
    () => episodes.find((e) => e.number === Number(ep)),
    [episodes, ep],
  )

  usePageTitle(anime && episode ? `${anime.title} ${episode.number}. Bölüm` : 'Bulunamadı')

  const [season, setSeason] = useState(episode?.season || 1)
  const [query, setQuery] = useState('')

  const { isEpisodeWatched, markEpisodeWatched, setProgress, pushHistory, getProgress, setListStatus } = useList()

  useEffect(() => {
    if (episode) setSeason(episode.season)
    setQuery('')
  }, [episode])

  useEffect(() => {
    if (anime && episode) {
      pushHistory(anime.id, episode.number)
      if (!isEpisodeWatched(anime.id, episode.number)) {
        setListStatus(anime.id, 'watching')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anime?.id, episode?.id])

  if (!anime || !episode) return <NotFoundPage />

  const seasons = getSeasons(anime)
  const progress = getProgress(anime.id)
  const savedTime = progress?.ep === episode.number ? progress.position : 0

  const seasonEpisodes = episodes.filter((e) => e.season === season)
  const filtered = query.trim()
    ? seasonEpisodes.filter(
        (e) =>
          e.title.toLocaleLowerCase('tr').includes(query.trim().toLocaleLowerCase('tr')) ||
          String(e.number) === query.trim(),
      )
    : seasonEpisodes

  const prevEpisode = episodes.find((e) => e.number === episode.number - 1)
  const nextEpisode = episodes.find((e) => e.number === episode.number + 1)

  const goNext = () => nextEpisode && navigate(`/izle/${anime.id}/${nextEpisode.number}`)
  const goPrev = () => prevEpisode && navigate(`/izle/${anime.id}/${prevEpisode.number}`)

  const handleEnded = () => {
    markEpisodeWatched(anime.id, episode.number)
  }

  return (
    <PageShell className="mx-auto max-w-[1600px] px-0 pb-10 pt-16 sm:px-4 md:pt-20 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <VideoPlayer
            anime={anime}
            episode={episode}
            initialTime={savedTime}
            onNext={nextEpisode ? goNext : null}
            onPrev={prevEpisode ? goPrev : null}
            onEnded={handleEnded}
            onProgress={(t) => setProgress(anime.id, episode.number, t, episode.duration * 60)}
          />

          <div className="mt-5 px-4 sm:px-0">
            <nav className="mb-3 flex items-center gap-2 text-xs font-semibold text-zinc-500" aria-label="Breadcrumb">
              <Link to="/animeler" className="transition-colors hover:text-white">
                Animeler
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <Link to={`/anime/${anime.id}`} className="truncate transition-colors hover:text-white">
                {anime.title}
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span className="text-akaru-300">{episode.number}. Bölüm</span>
            </nav>

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-extrabold text-white sm:text-2xl">
                  {anime.title}
                  <span className="ml-2 text-base font-bold text-zinc-400 sm:text-lg">
                    {episode.number}. Bölüm
                  </span>
                </h1>
                <p className="mt-1 text-sm font-semibold text-zinc-300">{episode.title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatDate(episode.airDate)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatViews(episode.views)} izlenme
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-current text-amber-300" aria-hidden="true" />
                    {anime.score.toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={!prevEpisode}
                  className="glass flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-bold text-white transition-colors hover:bg-white/12 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Önceki Bölüm</span>
                  <span className="sm:hidden">Önceki</span>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!nextEpisode}
                  className="flex h-11 items-center gap-2 rounded-xl bg-akaru-600 px-4 text-sm font-bold text-white shadow-glow-sm transition-colors hover:bg-akaru-500 disabled:opacity-30"
                >
                  <span className="hidden sm:inline">Sonraki Bölüm</span>
                  <span className="sm:hidden">Sonraki</span>
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-zinc-400">{anime.description}</p>

            <Link
              to={`/anime/${anime.id}`}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-akaru-400 transition-colors hover:text-akaru-300"
            >
              Anime detayına git
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-0 xl:hidden">
            {filtered.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => navigate(`/izle/${anime.id}/${e.number}`)}
                className={cx(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-colors',
                  e.number === episode.number
                    ? 'border-akaru-500/50 bg-akaru-600/10'
                    : 'border-white/[0.06] bg-panel hover:border-white/15',
                )}
              >
                <span
                  className={cx(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold',
                    e.number === episode.number
                      ? 'bg-akaru-600 text-white'
                      : isEpisodeWatched(anime.id, e.number)
                        ? 'bg-emerald-400/10 text-emerald-300'
                        : 'bg-white/[0.06] text-zinc-400',
                  )}
                >
                  {e.number}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-white">{e.title}</p>
                  <p className="text-xs text-zinc-500">
                    {isEpisodeWatched(anime.id, e.number) ? 'İzlendi' : formatDate(e.airDate)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-4">
            <div className="glass-strong overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-white/8 px-5 py-4">
                <h2 className="flex items-center gap-2 text-sm font-extrabold text-white">
                  <ListVideo className="h-[18px] w-[18px] text-akaru-400" aria-hidden="true" />
                  Bölümler
                </h2>
                <span className="rounded-md bg-white/8 px-2 py-0.5 text-[11px] font-bold text-zinc-400">
                  {episodes.length} bölüm
                </span>
              </div>

              {seasons.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto border-b border-white/8 px-4 py-3">
                  {seasons.map((s) => (
                    <button
                      key={s.no}
                      type="button"
                      onClick={() => setSeason(s.no)}
                      className={cx(
                        'shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all',
                        season === s.no
                          ? 'bg-akaru-600 text-white'
                          : 'bg-white/[0.06] text-zinc-400 hover:text-white',
                      )}
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-3">
                <div className="relative mb-3">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Bölüm ara…"
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/[0.04] pl-9 pr-3 text-sm font-medium text-white placeholder:text-zinc-600 transition-colors focus:border-akaru-500/60 focus:outline-none"
                    aria-label="Bölüm ara"
                  />
                </div>

                <div className="max-h-[480px] space-y-1 overflow-y-auto pr-1">
                  {filtered.length === 0 && (
                    <p className="py-8 text-center text-xs text-zinc-500">Bölüm bulunamadı.</p>
                  )}
                  {filtered.map((e) => {
                    const active = e.number === episode.number
                    const watched = isEpisodeWatched(anime.id, e.number)
                    return (
                      <button
                        key={e.id}
                        type="button"
                        onClick={() => navigate(`/izle/${anime.id}/${e.number}`)}
                        className={cx(
                          'flex w-full items-center gap-3 rounded-xl p-2.5 text-left transition-colors',
                          active ? 'bg-akaru-600/15 ring-1 ring-akaru-500/40' : 'hover:bg-white/5',
                        )}
                        aria-current={active ? 'true' : undefined}
                      >
                        <span
                          className={cx(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold',
                            active
                              ? 'bg-akaru-600 text-white shadow-glow-sm'
                              : watched
                                ? 'bg-emerald-400/10 text-emerald-300'
                                : 'bg-white/[0.06] text-zinc-400',
                          )}
                        >
                          {e.number}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cx(
                              'truncate text-sm font-bold',
                              active ? 'text-akaru-200' : watched ? 'text-zinc-400' : 'text-white',
                            )}
                          >
                            {e.title}
                          </p>
                          <p className="text-[11px] text-zinc-500">{formatDate(e.airDate)}</p>
                        </div>
                        {watched && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-label="İzlendi" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {nextEpisode && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-strong rounded-2xl p-4"
              >
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  Sıradaki Bölüm
                </p>
                <button
                  type="button"
                  onClick={goNext}
                  className="group flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-white/5"
                >
                  <img
                    src={anime.poster}
                    alt=""
                    className="h-16 w-11 rounded-lg object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-akaru-300">{nextEpisode.number}. Bölüm</p>
                    <p className="truncate text-sm font-bold text-white">{nextEpisode.title}</p>
                    <p className="text-[11px] text-zinc-500">{formatDate(nextEpisode.airDate)}</p>
                  </div>
                  <ChevronRight
                    className="ml-auto h-5 w-5 shrink-0 text-zinc-500 transition-transform group-hover:translate-x-1 group-hover:text-white"
                    aria-hidden="true"
                  />
                </button>
              </motion.div>
            )}
          </div>
        </aside>
      </div>
    </PageShell>
  )
}
