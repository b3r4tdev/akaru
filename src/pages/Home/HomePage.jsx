import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight, Flame, Grid2X2, Play, Sparkles, TrendingUp } from 'lucide-react'
import { Hero } from '@/components/Hero/Hero'
import { AnimeCard } from '@/components/AnimeCard/AnimeCard'
import { EpisodeCard } from '@/components/AnimeCard/EpisodeCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import { getAnimesWithArt, getFeatured, getGenreCounts, getPopular, withArt } from '@/data/animeData'
import { getNewEpisodes } from '@/data/episodes'
import { useList } from '@/context/ListContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { GENRES } from '@/data/animeData'
import { getAnimeById } from '@/data/animeData'

const CONTAINER = 'mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10'

export default function HomePage() {
  usePageTitle('')
  const { continueWatching, getProgress } = useList()
  const navigate = useNavigate()
  const newEpisodes = getNewEpisodes(10)
  const featured = getFeatured()
  const popular = getPopular(12)
  const genreCounts = getGenreCounts()
  const thisSeason = getAnimesWithArt()
    .filter((a) => a.year === 2025 && a.season === 'Ilkbahar')
    .slice(0, 6)

  const continueList = Object.entries(continueWatching)
    .map(([id, p]) => ({ anime: getAnimeById(id), progress: p }))
    .filter((x) => x.anime)
    .sort((a, b) => new Date(b.progress.at).getTime() - new Date(a.progress.at).getTime())
    .slice(0, 6)

  const newScrollRef = useRef(null)
  const scrollRow = (ref, dir) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  return (
    <div>
      <Hero featured={featured} />

      <div className="relative z-10 -mt-2 space-y-16 pb-8">
        {continueList.length > 0 && (
          <section className={`${CONTAINER} pt-4`}>
            <SectionHeader
              icon={Play}
              title="İzlemeye Devam Et"
              subtitle="Kaldığın yerden sürdür"
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
              {continueList.map(({ anime, progress }, i) => {
                const pct = Math.min(100, Math.round((progress.position / (progress.duration || 1)) * 100))
                return (
                  <motion.div
                    key={anime.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.05 }}
                  >
                    <Link to={`/izle/${anime.id}/${progress.ep}`} className="group block">
                      <div className="relative aspect-video overflow-hidden rounded-xl bg-elevate shadow-card">
                        <img
                          src={withArt(anime).banner}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent" aria-hidden="true" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-akaru-600/90 text-white opacity-0 shadow-glow-sm transition-opacity duration-300 group-hover:opacity-100">
                            <Play className="ml-0.5 h-5 w-5 fill-current" />
                          </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 p-3">
                          <p className="truncate text-sm font-bold text-white">{anime.title}</p>
                          <p className="text-xs text-zinc-400">{progress.ep}. Bölüm · %{pct}</p>
                          <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/20">
                            <div className="h-full rounded-full bg-akaru-500" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        <section className={CONTAINER}>
          <SectionHeader
            icon={Sparkles}
            title="Yeni Bölümler"
            subtitle="Az önce yayınlanan bölümler"
            linkTo="/animeler?siralama=yeni"
          />
          <div className="relative">
            <div
              ref={newScrollRef}
              className="scroll-row flex snap-x gap-4 overflow-x-auto pb-1"
              role="list"
              aria-label="Yeni bölümler"
            >
              {newEpisodes.map(({ anime, episode }, i) => (
                <EpisodeCard key={episode.id} anime={withArt(anime)} episode={episode} index={i} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => scrollRow(newScrollRef, -1)}
              className="glass absolute -left-3 top-1/3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-zinc-200 transition-colors hover:text-white md:flex"
              aria-label="Sola kaydır"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollRow(newScrollRef, 1)}
              className="glass absolute -right-3 top-1/3 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-zinc-200 transition-colors hover:text-white md:flex"
              aria-label="Sağa kaydır"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </section>

        <section className={CONTAINER}>
          <SectionHeader
            icon={Flame}
            title="Popüler Animeler"
            subtitle="Topluluğun en çok izlediği yapımlar"
            linkTo="/animeler?siralama=populer"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {popular.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
          </div>
        </section>

        <section className={CONTAINER}>
          <SectionHeader
            icon={TrendingUp}
            title="Bu Sezon: Ilkbahar 2025"
            subtitle="Sezonun en çok beklenen yapımları"
            linkTo="/animeler"
          />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {thisSeason.map((anime, i) => (
              <AnimeCard key={anime.id} anime={anime} index={i} />
            ))}
          </div>
        </section>

        <section className={CONTAINER}>
          <SectionHeader
            icon={Grid2X2}
            title="Türlerine Göre Keşfet"
            subtitle="Zevkine göre filtrele"
            linkTo="/turler"
          />
          <div className="flex flex-wrap gap-2.5">
            {GENRES.map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() => navigate(`/animeler?tur=${encodeURIComponent(g.name)}`)}
                className="group flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-panel px-4 py-3 text-sm font-bold text-zinc-300 transition-all hover:border-akaru-500/40 hover:bg-akaru-600/10 hover:text-white"
              >
                {g.name}
                <span className="rounded-md bg-white/8 px-1.5 py-0.5 text-[11px] font-bold text-zinc-500 transition-colors group-hover:bg-akaru-600/20 group-hover:text-akaru-200">
                  {genreCounts[g.name]}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className={CONTAINER}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="noise relative overflow-hidden rounded-3xl border border-akaru-500/20 bg-gradient-to-br from-akaru-950/60 via-panel to-panel p-8 sm:p-12"
          >
            <div
              className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-akaru-600/20 blur-[90px]"
              aria-hidden="true"
            />
            <div className="relative max-w-xl">
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
                Kendi izleme listeni oluştur
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400 sm:text-base">
                İzlediklerini işaretle, favorilerini sakla ve yeni bölümlerden ilk sen haberdar ol.
                Kişisel takvimin AKARU'da hazır.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button to="/listem" size="lg">
                  <CalendarDays className="h-5 w-5" aria-hidden="true" />
                  İzleme Listem
                </Button>
                <Button to="/takvim" variant="secondary" size="lg">
                  Yayın Takvimi
                </Button>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
