import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, LogIn, Menu, Search, X } from 'lucide-react'
import { useScrolled } from '@/hooks/useScrolled'
import { useClickOutside } from '@/hooks/useClickOutside'
import { Logo } from '@/components/Logo/Logo'
import { cx } from '@/utils/cx'
import { useAuth } from '@/context/AuthContext'
import { avatarArt } from '@/utils/artwork'
import { NotificationsDropdown } from './NotificationsDropdown'
import { MobileMenu } from './MobileMenu'
import { SearchModal } from './SearchModal'

const NAV_LINKS = [
  { to: '/', label: 'Ana Sayfa' },
  { to: '/animeler', label: 'Animeler' },
  { to: '/turler', label: 'Türler' },
  { to: '/animeler?siralama=yeni', label: 'Yeni Bölümler', match: 'siralama=yeni' },
  { to: '/animeler?siralama=populer', label: 'Popüler', match: 'siralama=populer' },
  { to: '/takvim', label: 'Takvim' },
]

function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [locked])
}

export function Navbar() {
  const scrolled = useScrolled(20)
  const location = useLocation()
  const { user, ready, openLogin, logout } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const notifRef = useClickOutside(() => setNotifOpen(false))
  const userMenuRef = useClickOutside(() => setUserMenuOpen(false))
  const searchBtnRef = useRef(null)

  useLockBody(menuOpen)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setNotifOpen(false)
    setUserMenuOpen(false)
  }, [location.pathname, location.search])

  const isLinkActive = (link) => {
    if (!link.match) return location.pathname === link.to && !location.search.includes('siralama=')
    return location.pathname + location.search === link.to
  }

  return (
    <>
      <header
        className={cx(
          'fixed inset-x-0 top-0 z-50 transition-all duration-300',
          scrolled
            ? 'border-b border-white/[0.06] bg-night/85 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent',
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 md:h-20"
          aria-label="Ana gezinme"
        >
          <Link to="/" className="shrink-0 transition-transform hover:scale-[1.03] active:scale-95" aria-label="AKARU ana sayfa">
            <Logo />
          </Link>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link)
              return (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className={cx(
                      'relative rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors',
                      active ? 'text-white' : 'text-zinc-400 hover:text-white',
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-akaru-500 to-akaru-300"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              ref={searchBtnRef}
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 transition-all hover:bg-white/10 hover:text-white"
              aria-label="Anime ara"
              title="Ara (Ctrl+K)"
            >
              <Search className="h-5 w-5" />
            </button>

            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((v) => !v)}
                className={cx(
                  'relative flex h-10 w-10 items-center justify-center rounded-xl transition-all hover:bg-white/10',
                  notifOpen ? 'text-akaru-300 bg-white/10' : 'text-zinc-300 hover:text-white',
                )}
                aria-label="Bildirimler"
                aria-expanded={notifOpen}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-akaru-500 shadow-glow-sm" aria-hidden="true" />
              </button>
              <AnimatePresence>{notifOpen && <NotificationsDropdown onClose={() => setNotifOpen(false)} />}</AnimatePresence>
            </div>

            {!ready ? (
              <span className="h-10 w-24 animate-pulse rounded-xl bg-white/5" aria-hidden="true" />
            ) : user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2.5 rounded-xl p-1 pr-2 transition-all hover:bg-white/10"
                  aria-label="Hesap menüsü"
                  aria-expanded={userMenuOpen}
                >
                  <img
                    src={avatarArt(user.username)}
                    alt=""
                    className="h-9 w-9 rounded-lg object-cover ring-1 ring-white/15"
                  />
                  <span className="hidden max-w-[7rem] truncate text-sm font-semibold text-zinc-200 md:block">
                    {user.displayName}
                  </span>
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      className="glass-strong absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl p-1.5 shadow-card"
                    >
                      <div className="border-b border-white/8 px-3 pb-2.5 pt-2">
                        <p className="truncate text-sm font-bold text-white">{user.displayName}</p>
                        <p className="truncate text-xs text-zinc-500">@{user.username}</p>
                      </div>
                      {[
                        { to: '/profil', label: 'Profilim' },
                        { to: '/listem', label: 'İzleme Listem' },
                        { to: '/takvim', label: 'Yayın Takvimi' },
                      ].map((item) => (
                        <Link
                          key={item.to}
                          to={item.to}
                          className="block rounded-lg px-3 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-white/8 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          logout()
                          setUserMenuOpen(false)
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-akaru-300 transition-colors hover:bg-akaru-600/10"
                      >
                        Çıkış Yap
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                type="button"
                onClick={openLogin}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-akaru-600 px-4 text-sm font-bold text-white shadow-glow-sm transition-all hover:bg-akaru-500 hover:shadow-glow active:scale-95"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span className="hidden sm:inline">Giriş Yap</span>
                <span className="sm:hidden">Giriş</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-300 transition-all hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Menüyü aç"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {searchOpen && (
          <SearchModal
            onClose={() => setSearchOpen(false)}
            returnFocusTo={searchBtnRef.current}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <MobileMenu
            links={NAV_LINKS}
            isLinkActive={isLinkActive}
            user={user}
            onClose={() => setMenuOpen(false)}
            onLogin={openLogin}
          />
        )}
      </AnimatePresence>
    </>
  )
}
