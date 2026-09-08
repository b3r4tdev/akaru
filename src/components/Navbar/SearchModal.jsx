import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, SearchX, TrendingUp, X } from 'lucide-react'
import { searchAnimes, getTrending } from '@/data/animeData'
import { ScoreBadge } from '@/components/ui/ScoreBadge'

export function SearchModal({ onClose, returnFocusTo }) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => searchAnimes(query), [query])
  const trending = useMemo(() => getTrending(6), [])

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 60)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      document.body.style.overflow = original
    }
  }, [])

  useEffect(() => setActiveIndex(0), [query])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose()
        returnFocusTo?.focus?.()
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, results.length - 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter' && results[activeIndex]) {
        navigate(`/anime/${results[activeIndex].id}`)
        onClose()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [results, activeIndex, navigate, onClose, returnFocusTo])

  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Anime arama"
    >
      <motion.div
        initial={{ opacity: 0, y: -24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -24, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        className="glass-strong mx-auto mt-[8vh] flex max-h-[82vh] w-[calc(100vw-2rem)] max-w-2xl flex-col overflow-hidden rounded-2xl shadow-card"
      >
        <div className="flex items-center gap-3 border-b border-white/8 px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-akaru-400" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Anime adı, tür veya stüdyo ara…"
            className="w-full bg-transparent text-base font-medium text-white placeholder:text-zinc-500 focus:outline-none"
            aria-label="Arama sorgusu"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="rounded-md p-1 text-zinc-500 transition-colors hover:text-white"
              aria-label="Sorguyu temizle"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden shrink-0 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold text-zinc-500 sm:block">
            ESC
          </kbd>
        </div>

        <div className="flex-1 overflow-y-auto p-3" role="listbox">
          {query.trim() === '' ? (
            <div className="p-3">
              <p className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
                <TrendingUp className="h-4 w-4 text-akaru-400" aria-hidden="true" />
                Popüler Aramalar
              </p>
              <div className="flex flex-wrap gap-2">
                {trending.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      navigate(`/anime/${a.id}`)
                      onClose()
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-zinc-300 transition-all hover:border-akaru-500/40 hover:text-white"
                  >
                    {a.title}
                  </button>
                ))}
              </div>
              <p className="mt-6 text-xs leading-relaxed text-zinc-600">
                İpucu: Arama yapmak için her yerde <strong className="text-zinc-400">Ctrl + K</strong> kısayolunu kullanabilirsin.
              </p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-zinc-500">
                <SearchX className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="mt-4 font-bold text-white">Sonuç bulunamadı</p>
              <p className="mt-1 text-sm text-zinc-500">
                "{query}" için eşleşme yok. Farklı bir anahtar kelime dene.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((anime, i) => (
                <li key={anime.id} role="option" aria-selected={i === activeIndex}>
                  <button
                    type="button"
                    onMouseEnter={() => setActiveIndex(i)}
                    onClick={() => {
                      navigate(`/anime/${anime.id}`)
                      onClose()
                    }}
                    className={`flex w-full items-center gap-3.5 rounded-xl p-2.5 text-left transition-colors ${
                      i === activeIndex ? 'bg-akaru-600/15' : 'hover:bg-white/5'
                    }`}
                  >
                    <img
                      src={anime.poster}
                      alt=""
                      className="h-16 w-11 shrink-0 rounded-lg object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-white">{anime.title}</p>
                      <p className="mt-0.5 text-xs text-zinc-500">
                        {anime.year} · {anime.type} · {anime.genres.slice(0, 3).join(', ')}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-zinc-600">{anime.englishTitle}</p>
                    </div>
                    <ScoreBadge score={anime.score} size="sm" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {query.trim() !== '' && results.length > 0 && (
          <div className="flex items-center justify-between border-t border-white/8 px-5 py-2.5 text-[11px] font-medium text-zinc-500">
            <span>{results.length} sonuç bulundu</span>
            <span className="hidden sm:block">↑ ↓ gezin · Enter seç</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
