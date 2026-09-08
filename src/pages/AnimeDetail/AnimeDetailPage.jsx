import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowDownWideNarrow,
  ArrowUpNarrowWide,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Film,
  Heart,
  Play,
  Search,
  Share2,
  Star,
  Tv,
} from 'lucide-react'
import { AnimeCard } from '@/components/AnimeCard/AnimeCard'
import { ScoreBadge } from '@/components/ui/ScoreBadge'
import { StatusBadge } from '@/components/ui/Badge'
import { PageShell } from '@/components/ui/PageShell'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'
import { getAnimeById, getSimilar, withArt } from '@/data/animeData'
import { getEpisodes, getSeasons } from '@/data/episodes'
import { useList } from '@/context/ListContext'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { formatDate, formatDuration, formatViews } from '@/utils/formatters'
import { cx } from '@/utils/cx'

export default function AnimeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, openLogin } = useAuth()
  const raw = getAnimeById(id)
  const anime = useMemo(() => (raw ? withArt(raw) : null), [raw])

  const [season, setSeason] = useState(1)
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState('desc')
  const [expanded, setExpanded] = useState(false)

  usePageTitle(anime?.title || 'Bulunamadı')

  const { statusOf, isFavorite, setListStatus, toggleFavorite, isEpisodeWatched, toggleEpisodeWatched, getProgress } = useList()

  if (!anime) return <NotFoundPage />

  const episodes = getEpisodes(anime)
  const seasons = getSeasons(anime)
  const progress = getProgress(anime.id)

  const seasonEpisodes = useMemo(() => {
    let list = episodes.filter((e) => e.season === season)
    if (query.trim()) {
      const q = query.trim().toLocaleLowerCase('tr')
      list = list.filter(
        (e) => e.title.toLocaleLowerCase('tr').includes(q) || String(e.number) === q,
      )
    }
    return order === 'desc' ? [...list].reverse() : list
  }, [episodes, season, query, order])

  const similar = useMemo(() => getSimilar(anime, 6), [anime])
  const fav = isFavorite(anime.id)
  const status = statusOf(anime.id)
  const totalEpisodes = anime.currentEpisode ?? anime.episodes

  const share = async () => {
    const url = window.location.href
    try {
      if (navigator.share) {
        await navigator.share({ title: `${anime.title} — AKARU`, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast('Bağlantı panoya kopyalandı', 'success')
      }
    } catch {
      toast('Paylaşım iptal edildi', 'info')
    }
  }

  const infoItems = [
    { icon: Calendar, label: 'Yayın Yılı', value: `${anime.year} · ${anime.season}` },
    { icon: Film, label: 'Bölüm Sayısı', value: `${totalEpisodes} Bölüm` },
    { icon: Clock, label: 'Bölüm Süresi', value: formatDuration(anime.duration) },
    { icon: Tv, label: 'Format', value: `${anime.type} · ${anime.ageRating}` },
    { icon: Building2, label: 'Stüdyo', value: anime.studio },
    { icon: Star, label: 'Puan', value: `${anime.score.toFixed(1)} / 10` },
  ]

  return (
    <PageShell>
      <div className="relative">
        <div className="relative h-[38vh] min-h-[280px] w-full md:h-[48vh]">
          <img
            src={anime.banner}
            alt=""
            className="h-full w-full object-cover"
            role="presentation"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-night via-night/55 to-night/25"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-night/85 via-transparent to-night/40"
            aria-hidden="true"
          />
          <div className="noise absolute inset-0" aria-hidden="true" />
        </div>

        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
          <div className="relative -mt-28 flex flex-col gap-6 sm:-mt-36 md:flex-row md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mx-auto w-40 shrink-0 sm:w-52 md:mx-0"
            >
              <img
                src={anime.poster}
                alt={`${anime.title} posteri`}
                className="aspect-[2/3] w-full rounded-2xl object-cover shadow-card ring-1 ring-white/10"
              />
              <div className="mt-4 hidden md:block">
                <StatusBadge status={anime.status} className="rounded-lg bg-black/50 px-3 py-1.5 backdrop-blur-md" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="min-w-0 flex-1 pb-2"
            >
              <div className="mb-3 flex flex-wrap items-center gap-2.5">
                <span className="rounded-md bg-akaru-600 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                  {anime.type}
                </span>
                <StatusBadge status={anime.status} />
                <span className="rounded-md bg-white/8 px-2.5 py-1 text-[11px] font-bold text-zinc-300">
                  {anime.ageRating}
                </span>
              </div>

              <h1 className="text-balance text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                {anime.title}
              </h1>
              <p className="mt-2 text-sm font-semibold text-zinc-400 sm:text-base">
                {anime.japaneseTitle} · {anime.englishTitle}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2.5">
                <ScoreBadge score={anime.score} size="lg" />
                <span className="text-sm font-semibold text-zinc-300">{anime.year}</span>
                <span className="h-1 w-1 rounded-full bg-zinc-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-zinc-300">
                  {totalEpisodes} Bölüm
                </span>
                <span className="h-1 w-1 rounded-full bg-zinc-600" aria-hidden="true" />
                <span className="text-sm font-semibold text-zinc-300">
                  {formatDuration(anime.duration)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {anime.genres.map((g) => (
                  <Link
                    key={g}
                    to={`/animeler?tur=${encodeURIComponent(g)}`}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-bold text-zinc-300 transition-colors hover:border-akaru-500/40 hover:text-akaru-200"
                  >
                    {g}
                  </Link>
                ))}
              </div>

              <p className={cx('mt-5 max-w-3xl text-sm leading-relaxed text-zinc-300', !expanded && 'line-clamp-3')}>
                {anime.description}
              </p>
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="mt-1 text-xs font-bold text-akaru-400 transition-colors hover:text-akaru-300"
              >
                {expanded ? 'Daha az göster' : 'Devamını oku'}
              </button>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  to={`/izle/${anime.id}/${progress?.ep || 1}`}
                  className="group inline-flex h-12 items-center gap-2.5 rounded-xl bg-akaru-600 px-6 text-base font-bold text-white shadow-glow-sm transition-all hover:bg-akaru-500 hover:shadow-glow active:scale-95"
                >
                  <Play className="h-5 w-5 fill-current" aria-hidden="true" />
                  {progress ? `${progress.ep}. Bölümden Devam Et` : 'İzlemeye Başla'}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    const nowFav = toggleFavorite(anime.id)
                    toast(
                      nowFav ? `${anime.title} favorilere eklendi` : `${anime.title} favorilerden çıkarıldı`,
                      'info',
                    )
                  }}
                  className={cx(
                    'inline-flex h-12 items-center gap-2 rounded-xl border px-5 text-sm font-bold transition-all active:scale-95',
                    fav
                      ? 'border-akaru-400/50 bg-akaru-600/15 text-akaru-200'
                      : 'glass text-white hover:border-akaru-400/40',
                  )}
                  aria-pressed={fav}
                >
                  <Heart className={cx('h-5 w-5', fav && 'fill-current')} aria-hidden="true" />
                  {fav ? 'Favorilerde' : 'Favorilere Ekle'}
                </button>
                <button
                  type="button"
                  onClick={share}
                  className="glass inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition-colors hover:border-akaru-400/40"
                >
                  <Share2 className="h-5 w-5" aria-hidden="true" />
                  Paylaş
                </button>
                {user ? (
                  <select
                    value={status || ''}
                    onChange={(e) => {
                      setListStatus(anime.id, e.target.value || null)
                      toast(
                        e.target.value
                          ? `${anime.title} "${{ watching: 'İzliyorum', planned: 'İzleyeceğim', completed: 'Tamamladım', dropped: 'Yarım Bıraktım' }[e.target.value]}" listesine eklendi`
                          : `${anime.title} listeden çıkarıldı`,
                        'success',
                      )
                    }}
                    className="h-12 cursor-pointer rounded-xl border border-white/10 bg-panel px-4 text-sm font-bold text-zinc-200 transition-colors hover:border-akaru-500/40 focus:outline-none"
                    aria-label="Listem durumu"
                  >
                    <option value="">Listeme Ekle</option>
                    <option value="watching">İzliyorum</option>
                    <option value="planned">İzleyeceğim</option>
                    <option value="completed">Tamamladım</option>
                    <option value="dropped">Yarım Bıraktım</option>
                  </select>
                ) : (
                  <button
                    type="button"
                    onClick={openLogin}
                    className="glass inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition-colors hover:border-akaru-400/40"
                  >
                    Listeme Ekle
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {infoItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
                className="rounded-xl border border-white/[0.06] bg-panel p-4"
              >
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                  <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.label}
                </p>
                <p className="mt-1.5 truncate text-sm font-bold text-white">{item.value}</p>
              </motion.div>
            ))}
          </div>

          <section className="mt-14">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold text-white sm:text-2xl">Bölümler</h2>
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Bölüm ara…"
                    className="h-10 w-44 rounded-xl border border-white/10 bg-panel pl-9 pr-3 text-sm font-medium text-white placeholder:text-zinc-600 transition-colors focus:border-akaru-500/60 focus:outline-none"
                    aria-label="Bölüm ara"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
                  className="glass flex h-10 items-center gap-2 rounded-xl px-3.5 text-sm font-bold text-zinc-200 transition-colors hover:text-white"
                  aria-label={order === 'desc' ? 'Artan sırala' : 'Azalan sırala'}
                >
                  {order === 'desc' ? (
                    <ArrowDownWideNarrow className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <ArrowUpNarrowWide className="h-4 w-4" aria-hidden="true" />
                  )}
                  {order === 'desc' ? 'Yeni → Eski' : 'Eski → Yeni'}
                </button>
              </div>
            </div>

            {seasons.length > 1 && (
              <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Sezonlar">
                {seasons.map((s) => (
                  <button
                    key={s.no}
                    type="button"
                    role="tab"
                    aria-selected={season === s.no}
                    onClick={() => setSeason(s.no)}
                    className={cx(
                      'shrink-0 rounded-xl px-5 py-2.5 text-sm font-bold transition-all',
                      season === s.no
                        ? 'bg-akaru-600 text-white shadow-glow-sm'
                        : 'border border-white/10 bg-panel text-zinc-400 hover:text-white',
                    )}
                  >
                    {s.title}
                    <span className="ml-2 text-[11px] font-semibold opacity-70">
                      {episodes.filter((e) => e.season === s.no).length} bölüm
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
              {seasonEpisodes.length === 0 ? (
                <p className="px-6 py-10 text-center text-sm text-zinc-500">
                  Aramanla eşleşen bölüm bulunamadı.
                </p>
              ) : (
                <ul className="divide-y divide-white/[0.05]">
                  {seasonEpisodes.map((ep) => {
                    const watched = isEpisodeWatched(anime.id, ep.number)
                    return (
                      <li key={ep.id}>
                        <div
                          className={cx(
                            'group flex cursor-pointer items-center gap-4 px-4 py-3.5 transition-colors hover:bg-white/[0.04] sm:px-6',
                            watched && 'bg-emerald-400/[0.03]',
                          )}
                          onClick={() => navigate(`/izle/${anime.id}/${ep.number}`)}
                          role="link"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && navigate(`/izle/${anime.id}/${ep.number}`)}
                        >
                          <span
                            className={cx(
                              'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold transition-colors',
                              watched
                                ? 'bg-emerald-400/10 text-emerald-300'
                                : 'bg-white/[0.06] text-zinc-400 group-hover:bg-akaru-600/20 group-hover:text-akaru-300',
                            )}
                            aria-hidden="true"
                          >
                            {ep.number}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className={cx('truncate text-sm font-bold', watched ? 'text-zinc-400' : 'text-white')}>
                              {ep.title}
                            </p>
                            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-zinc-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" aria-hidden="true" />
                                {formatDate(ep.airDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" aria-hidden="true" />
                                {formatViews(ep.views)} izlenme
                              </span>
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleEpisodeWatched(anime.id, ep.number)
                            }}
                            className={cx(
                              'hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all sm:flex',
                              watched
                                ? 'text-emerald-400'
                                : 'text-zinc-600 opacity-0 hover:text-white group-hover:opacity-100',
                            )}
                            aria-label={watched ? 'İzlendi işaretini kaldır' : 'İzlendi olarak işaretle'}
                          >
                            <CheckCircle2 className={cx('h-5 w-5', watched && 'fill-emerald-400/15')} />
                          </button>
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-akaru-600 text-white opacity-0 shadow-glow-sm transition-all group-hover:opacity-100">
                            <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
                          </span>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </section>

          {similar.length > 0 && (
            <section className="mt-14">
              <h2 className="mb-6 text-xl font-extrabold text-white sm:text-2xl">Benzer Animeler</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {similar.map((a, i) => (
                  <AnimeCard key={a.id} anime={a} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </PageShell>
  )
}
