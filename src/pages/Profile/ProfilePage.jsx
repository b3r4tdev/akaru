import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Flame,
  Heart,
  LogIn,
  Pencil,
  Play,
  PlayCircle,
  Trophy,
  UserRound,
  X,
} from 'lucide-react'
import { AnimeCard } from '@/components/AnimeCard/AnimeCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/ui/PageShell'
import { getAnimeById, withArt } from '@/data/animeData'
import { useAuth } from '@/context/AuthContext'
import { useList } from '@/context/ListContext'
import { useToast } from '@/context/ToastContext'
import { avatarArt } from '@/utils/artwork'
import { formatDate } from '@/utils/formatters'
import { usePageTitle } from '@/hooks/usePageTitle'
import { cx } from '@/utils/cx'

export default function ProfilePage() {
  usePageTitle('Profilim')
  const { user, openLogin, updateUser } = useAuth()
  const { lists, history, getStats } = useList()
  const { toast } = useToast()
  const [editOpen, setEditOpen] = useState(false)
  const [nameDraft, setNameDraft] = useState('')
  const [bioDraft, setBioDraft] = useState('')

  const stats = useMemo(() => getStats(), [getStats])

  const recent = useMemo(
    () =>
      history
        .map((h) => {
          const anime = getAnimeById(h.animeId)
          return anime ? { anime: withArt(anime), ep: h.ep, at: h.at } : null
        })
        .filter(Boolean)
        .slice(0, 6),
    [history],
  )

  const favorites = useMemo(
    () =>
      lists.favorites
        .map((id) => {
          const anime = getAnimeById(id)
          return anime ? withArt(anime) : null
        })
        .filter(Boolean)
        .slice(0, 6),
    [lists.favorites],
  )

  const watchlist = useMemo(
    () =>
      [...lists.watching, ...lists.planned]
        .filter((id, i, arr) => arr.indexOf(id) === i)
        .map((id) => {
          const anime = getAnimeById(id)
          return anime ? withArt(anime) : null
        })
        .filter(Boolean)
        .slice(0, 6),
    [lists],
  )

  if (!user) {
    return (
      <PageShell className="mx-auto flex min-h-[70vh] max-w-[1440px] items-center px-4 py-24 sm:px-6 lg:px-10">
        <EmptyState
          icon={UserRound}
          title="Bu alan üyelere özel"
          description="İzleme istatistiklerini, geçmişini ve rozetlerini görmek için demo hesabıyla giriş yap."
          action={
            <Button onClick={openLogin} size="lg">
              <LogIn className="h-5 w-5" aria-hidden="true" />
              Giriş Yap
            </Button>
          }
        />
      </PageShell>
    )
  }

  const startEdit = () => {
    setNameDraft(user.displayName)
    setBioDraft(user.bio || '')
    setEditOpen(true)
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    const res = await updateUser({
      displayName: nameDraft.trim() || user.displayName,
      bio: bioDraft.trim(),
    })
    if (res.ok) {
      setEditOpen(false)
      toast('Profil güncellendi', 'success')
    } else {
      toast(res.error || 'Profil güncellenemedi', 'error')
    }
  }

  const STAT_CARDS = [
    { icon: CheckCircle2, label: 'Tamamlanan Anime', value: stats.completed, cls: 'text-emerald-400' },
    { icon: Eye, label: 'İzlenen Bölüm', value: stats.episodes, cls: 'text-sky-400' },
    { icon: Heart, label: 'Favori Anime', value: stats.favorites, cls: 'text-akaru-400' },
    { icon: Clock, label: 'Toplam Süre', value: `${stats.totalHours} sa`, cls: 'text-amber-400' },
  ]

  return (
    <PageShell className="mx-auto max-w-[1440px] px-4 pb-16 pt-24 sm:px-6 md:pt-28 lg:px-10">
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="noise relative overflow-hidden rounded-3xl border border-white/[0.06] bg-panel p-6 sm:p-8"
      >
        <div
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-akaru-600/15 blur-[80px]"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <img
            src={avatarArt(user.username)}
            alt="Profil"
            className="h-24 w-24 rounded-2xl object-cover shadow-card ring-2 ring-akaru-500/30 sm:h-28 sm:w-28"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{user.displayName}</h1>
              <span className="flex items-center gap-1.5 rounded-lg bg-akaru-600/15 px-2.5 py-1 text-[11px] font-extrabold text-akaru-300">
                <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                Anime Tutkunu
              </span>
            </div>
            <p className="text-sm font-semibold text-zinc-500">@{user.username}</p>
            {user.bio && <p className="mt-2 max-w-xl text-sm text-zinc-400">{user.bio}</p>}
            <p className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              Katılım: {formatDate(user.joinedAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={startEdit}
            className="glass inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-5 text-sm font-bold text-white transition-colors hover:border-akaru-400/40"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
            Profili Düzenle
          </button>
        </div>
      </motion.header>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="rounded-2xl border border-white/[0.06] bg-panel p-5"
          >
            <card.icon className={cx('h-6 w-6', card.cls)} aria-hidden="true" />
            <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{card.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-zinc-500">
              {card.label}
            </p>
          </motion.div>
        ))}
      </div>

      {recent.length > 0 && (
        <section className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-white">
              <Flame className="h-5 w-5 text-akaru-400" aria-hidden="true" />
              Son İzlenenler
            </h2>
            <Link to="/takvim" className="text-sm font-bold text-zinc-400 transition-colors hover:text-akaru-300">
              Takvime Git
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recent.map(({ anime, ep }, i) => (
              <motion.div
                key={`${anime.id}-${ep}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link to={`/izle/${anime.id}/${ep}`} className="group block">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-elevate shadow-card">
                    <img
                      src={anime.banner}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent"
                      aria-hidden="true"
                    />
                    <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-akaru-600 text-white shadow-glow-sm">
                        <Play className="ml-0.5 h-5 w-5 fill-current" />
                      </span>
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-2.5">
                      <p className="truncate text-xs font-bold text-white">{anime.title}</p>
                      <p className="text-[11px] text-zinc-400">{ep}. Bölüm</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {[
        { title: 'Favoriler', icon: Heart, items: favorites, emptyTo: '/animeler', emptyLabel: 'Favori ekle' },
        { title: 'İzleme Listesi', icon: PlayCircle, items: watchlist, emptyTo: '/listem', emptyLabel: 'Listeye git' },
      ].map((section) => (
        <section key={section.title} className="mt-12">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2.5 text-xl font-extrabold text-white">
              <section.icon className="h-5 w-5 text-akaru-400" aria-hidden="true" />
              {section.title}
            </h2>
          </div>
          {section.items.length === 0 ? (
            <EmptyState
              icon={section.icon}
              title={`${section.title} boş`}
              description="Keşfet sayfasından başlayarak listeni zenginleştirebilirsin."
              action={<Button to={section.emptyTo} variant="secondary">{section.emptyLabel}</Button>}
            />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {section.items.map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} index={i} />
              ))}
            </div>
          )}
        </section>
      ))}

      {editOpen && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Profili düzenle"
        >
          <motion.form
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onSubmit={saveEdit}
            className="glass-strong w-full max-w-sm rounded-2xl p-7 shadow-card"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white">Profili Düzenle</h3>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <label htmlFor="edit-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500">
              Görünen Ad
            </label>
            <input
              id="edit-name"
              type="text"
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors focus:border-akaru-500/60 focus:outline-none"
            />
            <label htmlFor="edit-bio" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500">
              Hakkında
            </label>
            <textarea
              id="edit-bio"
              rows={3}
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              className="mb-6 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-600 transition-colors focus:border-akaru-500/60 focus:outline-none"
              placeholder="Kendini kısaca anlat…"
            />
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Kaydet
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                İptal
              </Button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </PageShell>
  )
}
