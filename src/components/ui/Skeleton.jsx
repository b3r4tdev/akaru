import { cx } from '@/utils/cx'

export function Skeleton({ className = '' }) {
  return <div className={cx('skeleton rounded-lg', className)} aria-hidden="true" />
}

export function AnimeCardSkeleton() {
  return (
    <div className="space-y-2.5">
      <Skeleton className="aspect-[2/3] w-full rounded-xl" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-3/5" />
    </div>
  )
}

export function AnimeGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <AnimeCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function EpisodeRowSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="h-16 w-28 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}
