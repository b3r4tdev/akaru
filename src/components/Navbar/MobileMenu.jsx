import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Clock, Compass, DoorOpen, Drama, Ghost, Heart, Home, Laugh, PlayCircle, Rocket, Swords, Tv, Wand2, X, Zap } from 'lucide-react'
import { Logo } from '@/components/Logo/Logo'
import { GENRES } from '@/data/animeData'
import { avatarArt } from '@/utils/artwork'
import { cx } from '@/utils/cx'

const GENRE_ICONS = {
  Aksiyon: Swords,
  Macera: Compass,
  Fantastik: Wand2,
  Romantizm: Heart,
  Komedi: Laugh,
  Dram: Drama,
  'Bilim Kurgu': Rocket,
  Shounen: Zap,
  Isekai: DoorOpen,
  Korku: Ghost,
}

export function MobileMenu({ links, isLinkActive, user, onClose, onLogin }) {
  return (
    <>
      <motion.div
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.aside
        className="glass-strong fixed inset-y-0 right-0 z-[61] flex w-[86%] max-w-sm flex-col overflow-y-auto bg-night/95 p-6"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        role="dialog"
        aria-label="Mobil menü"
      >
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" onClick={onClose}>
            <Logo />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Menüyü kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {user ? (
          <Link
            to="/profil"
            onClick={onClose}
            className="mb-6 flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
          >
            <img src={avatarArt(user.username)} alt="" className="h-11 w-11 rounded-lg object-cover" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{user.displayName}</p>
              <p className="truncate text-xs text-zinc-500">Profili görüntüle</p>
            </div>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              onClose()
              onLogin()
            }}
            className="mb-6 flex h-12 items-center justify-center gap-2 rounded-xl bg-akaru-600 text-sm font-bold text-white shadow-glow-sm transition-colors hover:bg-akaru-500"
          >
            Giriş Yap
          </button>
        )}

        <nav aria-label="Mobil gezinme">
          <ul className="space-y-1">
            {links.map((link, i) => {
              const active = isLinkActive(link)
              return (
                <motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04 }}
                >
                  <Link
                    to={link.to}
                    onClick={onClose}
                    className={cx(
                      'flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors',
                      active ? 'bg-akaru-600/15 text-akaru-300' : 'text-zinc-300 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    {link.label}
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-akaru-500" aria-hidden="true" />}
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        <div className="mt-8 border-t border-white/8 pt-6">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            <Tv className="h-4 w-4" aria-hidden="true" />
            Popüler Türler
          </p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => {
              const Icon = GENRE_ICONS[g.name] || Tv
              return (
                <Link
                  key={g.name}
                  to={`/animeler?tur=${encodeURIComponent(g.name)}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-akaru-500/40 hover:text-white"
                >
                  <Icon className="h-4 w-4 text-akaru-400" aria-hidden="true" />
                  {g.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-auto pt-10">
          <Link
            to="/takvim"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-sm font-bold text-zinc-300 transition-colors hover:text-white"
          >
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            Yayın Takvimi
          </Link>
        </div>
      </motion.aside>
    </>
  )
}
