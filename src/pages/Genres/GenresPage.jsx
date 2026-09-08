import { LayoutGrid } from 'lucide-react'
import { GenreCard } from '@/components/AnimeCard/GenreCard'
import { PageShell } from '@/components/ui/PageShell'
import { GENRES, getGenreCounts } from '@/data/animeData'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function GenresPage() {
  usePageTitle('Türler')
  const counts = getGenreCounts()

  return (
    <PageShell className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-10">
      <div className="mb-10">
        <h1 className="flex items-center gap-3 text-3xl font-extrabold text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-akaru-600/15 text-akaru-400">
            <LayoutGrid className="h-6 w-6" aria-hidden="true" />
          </span>
          Türler
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          Zevkine göre keşfet: her tür, sana özel küratörlü bir koleksiyon.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {GENRES.map((g, i) => (
          <GenreCard key={g.name} name={g.name} count={counts[g.name]} index={i} />
        ))}
      </div>
    </PageShell>
  )
}
