import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, LayoutGrid, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import { AnimeCard } from '@/components/AnimeCard/AnimeCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { AnimeGridSkeleton } from '@/components/ui/Skeleton'
import { PageShell } from '@/components/ui/PageShell'
import { GENRES, SEASONS, STATUSES, getAnimesWithArt } from '@/data/animeData'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cx } from '@/utils/cx'

const SORTS = [
  { key: 'populer', label: 'En Popüler' },
  { key: 'yeni', label: 'En Yeni' },
  { key: 'puan', label: 'En Yüksek Puan' },
  { key: 'az', label: 'A-Z' },
  { key: 'son-eklenen', label: 'Son Eklenen' },
]

const DEFAULT_FILTERS = {
  tur: '',
  yil: '',
  durum: '',
  sezon: '',
  puan: '',
  bolum: '',
  siralama: 'populer',
}

const SELECT_CLASS =
  'w-full cursor-pointer appearance-none rounded-xl border border-white/10 bg-panel px-4 py-2.5 pr-9 text-sm font-semibold text-zinc-200 transition-colors hover:border-akaru-500/40 focus:border-akaru-500/60 focus:outline-none'

function SortSelect({ value, onChange }) {
  const current = SORTS.find((s) => s.key === value) || SORTS[0]
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={SELECT_CLASS}
        aria-label="Sıralama"
      >
        {SORTS.map((s) => (
          <option key={s.key} value={s.key}>
            {s.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] font-bold text-akaru-400">
        ▼
      </span>
      <span className="pointer-events-none absolute -top-2.5 left-3 rounded bg-night px-1.5 text-[10px] font-bold uppercase tracking-wide text-zinc-500">
        {current.label}
      </span>
    </div>
  )
}

export default function AnimeListPage() {
  usePageTitle('Animeler')
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS })
  const [loading, setLoading] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    const fromUrl = { ...DEFAULT_FILTERS }
    for (const key of Object.keys(DEFAULT_FILTERS)) {
      fromUrl[key] = searchParams.get(key) || DEFAULT_FILTERS[key]
    }
    setFilters(fromUrl)
  }, [searchParams])

  const allAnimes = useMemo(() => getAnimesWithArt(), [])

  const years = useMemo(
    () => [...new Set(allAnimes.map((a) => a.year))].sort((a, b) => b - a),
    [allAnimes],
  )

  const results = useMemo(() => {
    let list = [...allAnimes]
    if (filters.tur) list = list.filter((a) => a.genres.includes(filters.tur))
    if (filters.yil) list = list.filter((a) => a.year === Number(filters.yil))
    if (filters.durum) list = list.filter((a) => a.status === filters.durum)
    if (filters.sezon) list = list.filter((a) => a.season === filters.sezon)
    if (filters.puan) list = list.filter((a) => a.score >= Number(filters.puan))
    if (filters.bolum) list = list.filter((a) => a.episodes >= Number(filters.bolum))

    switch (filters.siralama) {
      case 'yeni':
        list.sort((a, b) => b.year - a.year || b.popularity - a.popularity)
        break
      case 'puan':
        list.sort((a, b) => b.score - a.score)
        break
      case 'az':
        list.sort((a, b) => a.title.localeCompare(b.title, 'tr'))
        break
      case 'son-eklenen':
        list.sort((a, b) => a.addedDaysAgo - b.addedDaysAgo)
        break
      default:
        list.sort((a, b) => b.popularity - a.popularity)
    }
    return list
  }, [allAnimes, filters])

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [filters])

  const setFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (value && value !== DEFAULT_FILTERS[key]) {
      next.set(key, value)
    } else {
      next.delete(key)
    }
    setSearchParams(next, { preventScrollReset: true })
  }

  const clearFilters = () => setSearchParams({}, { preventScrollReset: true })

  const activeChips = Object.entries({
    tur: filters.tur,
    yil: filters.yil && `${filters.yil}`,
    durum: filters.durum,
    sezon: filters.sezon,
    puan: filters.puan && `${filters.puan}+ puan`,
    bolum: filters.bolum && `${filters.bolum}+ bölüm`,
  }).filter(([, v]) => v)

  const filterPanel = (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
      {[
        { key: 'tur', label: 'Tür', options: GENRES.map((g) => g.name) },
        { key: 'yil', label: 'Yayın Yılı', options: years.map(String) },
        { key: 'durum', label: 'Durum', options: STATUSES },
        { key: 'sezon', label: 'Sezon', options: SEASONS },
        { key: 'puan', label: 'Min. Puan', options: ['7', '8', '8.5', '9'] },
        { key: 'bolum', label: 'Min. Bölüm', options: ['12', '24', '36', '50'] },
      ].map(({ key, label, options }) => (
        <div key={key}>
          <label
            id={`filter-${key}-label`}
            className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500"
          >
            {label}
          </label>
          <div className="relative">
            <select
              value={filters[key]}
              onChange={(e) => setFilter(key, e.target.value)}
              className={SELECT_CLASS}
              aria-labelledby={`filter-${key}-label`}
            >
              <option value="">Tümü</option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {key === 'puan' ? `${opt}+` : opt}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] text-zinc-500">
              ▼
            </span>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <PageShell className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-akaru-600/15 text-akaru-400">
              <LayoutGrid className="h-6 w-6" aria-hidden="true" />
            </span>
            Animeler
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {results.length} anime listeleniyor
            {filters.tur ? ` · ${filters.tur} türü` : ''}
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="glass flex h-[42px] items-center gap-2 rounded-xl px-4 text-sm font-bold text-zinc-200 transition-colors hover:text-white lg:hidden"
            aria-expanded={mobileFiltersOpen}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtreler
            {activeChips.length > 0 && (
              <span className="rounded-full bg-akaru-600 px-1.5 text-[11px] font-extrabold text-white">
                {activeChips.length}
              </span>
            )}
          </button>
          <div className="w-44">
            <SortSelect value={filters.siralama} onChange={(v) => setFilter('siralama', v)} />
          </div>
        </div>
      </div>

      <div className="mb-6 hidden lg:block">{filterPanel}</div>

      {mobileFiltersOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-6 overflow-hidden lg:hidden"
        >
          <div className="rounded-2xl border border-white/[0.06] bg-panel p-4">{filterPanel}</div>
        </motion.div>
      )}

      {activeChips.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {activeChips.map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key, '')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-akaru-500/30 bg-akaru-600/10 px-3 py-1.5 text-xs font-bold text-akaru-200 transition-colors hover:bg-akaru-600/20"
            >
              {value}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-400 transition-colors hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Temizle
          </button>
        </div>
      )}

      {loading ? (
        <AnimeGridSkeleton count={12} />
      ) : results.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="Filtrelere uygun anime bulunamadı"
          description="Bazı filtreleri kaldırarak aramayı genişletebilirsin."
          action={
            <Button onClick={clearFilters} variant="secondary">
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Filtreleri Temizle
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {results.map((anime, i) => (
            <AnimeCard key={anime.id} anime={anime} index={i} />
          ))}
        </div>
      )}
    </PageShell>
  )
}
