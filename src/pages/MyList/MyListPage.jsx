import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookmarkPlus, CheckCircle2, Clock, Heart, PlayCircle, XCircle } from 'lucide-react'
import { AnimeCard } from '@/components/AnimeCard/AnimeCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/ui/PageShell'
import { getAnimeById, withArt } from '@/data/animeData'
import { useList } from '@/context/ListContext'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cx } from '@/utils/cx'

const TABS = [
  { key: 'watching', label: 'İzliyorum', icon: PlayCircle },
  { key: 'planned', label: 'İzleyeceğim', icon: Clock },
  { key: 'completed', label: 'Tamamladım', icon: CheckCircle2 },
  { key: 'dropped', label: 'Yarım Bıraktım', icon: XCircle },
  { key: 'favorites', label: 'Favoriler', icon: Heart },
]

export default function MyListPage() {
  usePageTitle('İzleme Listem')
  const { lists } = useList()
  const [tab, setTab] = useState('watching')

  const items = useMemo(
    () =>
      (lists[tab] || [])
        .map((id) => {
          const anime = getAnimeById(id)
          return anime ? withArt(anime) : null
        })
        .filter(Boolean),
    [lists, tab],
  )

  const currentTab = TABS.find((t) => t.key === tab)

  return (
    <PageShell className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-10">
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-akaru-600/15 text-akaru-400">
            <BookmarkPlus className="h-6 w-6" aria-hidden="true" />
          </span>
          İzleme Listem
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Kendi arşivini yönet: izlediklerini, planlarını ve favorilerini tek yerde tut.
        </p>
      </div>

      <div
        className="scroll-row mb-8 flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="Liste kategorileri"
      >
        {TABS.map((t) => {
          const count = lists[t.key]?.length || 0
          const active = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.key)}
              className={cx(
                'flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all',
                active
                  ? 'bg-akaru-600 text-white shadow-glow-sm'
                  : 'border border-white/[0.06] bg-panel text-zinc-400 hover:text-white',
              )}
            >
              <t.icon className="h-4 w-4" aria-hidden="true" />
              {t.label}
              <span
                className={cx(
                  'rounded-md px-1.5 py-0.5 text-[11px] font-extrabold',
                  active ? 'bg-black/25 text-white' : 'bg-white/8 text-zinc-500',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={currentTab?.icon || BookmarkPlus}
          title={`${currentTab?.label} listen henüz boş`}
          description="Anime sayfalarındaki butonları kullanarak listelerine ekleme yapabilirsin."
          action={
            <Button to="/animeler">
              Animeleri Keşfet
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {items.map((anime, i) => (
            <motion.div
              key={anime.id}
              layout
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <AnimeCard anime={anime} index={i} />
            </motion.div>
          ))}
        </div>
      )}

      <p className="mt-10 text-center text-xs text-zinc-600">
        Listen cihazında saklanır — üye olmadan da kullanabilirsin.{' '}
        <Link to="/animeler" className="font-bold text-akaru-400 hover:text-akaru-300">
          Yeni animeler keşfet
        </Link>
      </p>
    </PageShell>
  )
}
