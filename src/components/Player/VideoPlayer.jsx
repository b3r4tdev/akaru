import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Gauge,
  Languages,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  RectangleHorizontal,
  RotateCcw,
  RotateCw,
  Settings,
  SkipBack,
  SkipForward,
  Subtitles,
  Volume1,
  Volume2,
  VolumeX,
  WifiOff,
} from 'lucide-react'
import { formatTime } from '@/utils/formatters'
import { cx } from '@/utils/cx'
import { useToast } from '@/context/ToastContext'

const QUALITIES = ['Otomatik', '1080p', '720p', '480p']
const SUBTITLES = ['Türkçe', 'İngilizce', 'Japonca', 'Kapalı']

export function VideoPlayer({ anime, episode, initialTime = 0, onNext, onPrev, onEnded, onProgress }) {
  const { toast } = useToast()
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const hideTimerRef = useRef(null)
  const lastSentRef = useRef(-1)

  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [bufferedPct, setBufferedPct] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [failed, setFailed] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [quality, setQuality] = useState('Otomatik')
  const [subtitle, setSubtitle] = useState('Türkçe')
  const [autoplay, setAutoplay] = useState(true)
  const [cinema, setCinema] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [ended, setEnded] = useState(false)

  const effectiveVolume = muted ? 0 : volume

  useEffect(() => {
    setEnded(false)
    setFailed(false)
    setCurrent(0)
    setWaiting(false)
    lastSentRef.current = -1
  }, [episode.id])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = effectiveVolume
    v.muted = muted
  }, [effectiveVolume, muted, episode.id])

  useEffect(() => {
    const onFsChange = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  const revealControls = useCallback(() => {
    setShowControls(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (!settingsOpen) setShowControls(false)
    }, 2800)
  }, [settingsOpen])

  useEffect(() => {
    revealControls()
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [revealControls])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v || failed) return
    if (ended) {
      v.currentTime = 0
      setEnded(false)
      v.play().catch(() => {})
      return
    }
    if (v.paused) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }, [ended, failed])

  const seekBy = useCallback(
    (delta) => {
      const v = videoRef.current
      if (!v || !v.duration) return
      v.currentTime = Math.min(Math.max(v.currentTime + delta, 0), v.duration)
      revealControls()
    },
    [revealControls],
  )

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await containerRef.current?.requestFullscreen?.()
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return
      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'arrowright':
          e.preventDefault()
          seekBy(5)
          break
        case 'arrowleft':
          e.preventDefault()
          seekBy(-5)
          break
        case 'm':
          setMuted((m) => !m)
          break
        case 'f':
          toggleFullscreen()
          break
        case 't':
          setCinema((c) => !c)
          break
        default:
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [togglePlay, seekBy, toggleFullscreen])

  useEffect(() => {
    if (!ended || !autoplay || !onNext) return
    const t = setTimeout(() => onNext(), 2400)
    return () => clearTimeout(t)
  }, [ended, autoplay, onNext])

  const handleLoadedMetadata = () => {
    const v = videoRef.current
    if (!v) return
    setDuration(v.duration || 0)
    if (initialTime > 0 && initialTime < (v.duration || 0) - 3) {
      v.currentTime = initialTime
    }
    v.play().catch(() => {})
  }

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    setCurrent(v.currentTime)
    if (v.buffered.length && v.duration) {
      setBufferedPct(Math.min(100, (v.buffered.end(v.buffered.length - 1) / v.duration) * 100))
    }
    if (Math.abs(v.currentTime - lastSentRef.current) >= 2) {
      lastSentRef.current = v.currentTime
      onProgress?.(v.currentTime, v.duration)
    }
  }

  const handleEnded = () => {
    setPlaying(false)
    setEnded(true)
    onEnded?.()
  }

  const handleSeekClick = (e) => {
    const v = videoRef.current
    if (!v || !v.duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const ratio = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    v.currentTime = ratio * v.duration
    setEnded(false)
    revealControls()
  }

  const retry = () => {
    const v = videoRef.current
    if (!v) return
    setFailed(false)
    v.load()
    v.play().catch(() => {})
  }

  const selectQuality = (q) => {
    setQuality(q)
    setSettingsOpen(false)
    toast(`Kalite ${q} olarak ayarlandı`, 'info')
  }

  const selectSubtitle = (s) => {
    setSubtitle(s)
    setSettingsOpen(false)
    toast(s === 'Kapalı' ? 'Altyazılar kapatıldı' : `Altyazı: ${s}`, 'info')
  }

  const progressPct = duration ? (current / duration) * 100 : 0

  return (
    <div
      ref={containerRef}
      className={cx(
        'group relative select-none overflow-hidden bg-black',
        cinema ? 'fixed inset-0 z-[80] rounded-none' : 'aspect-video w-full rounded-none sm:rounded-2xl',
      )}
      onMouseMove={revealControls}
      onMouseLeave={() => !settingsOpen && setShowControls(false)}
      role="region"
      aria-label={`${anime.title} ${episode.number}. bölüm oynatıcı`}
    >
      <div className={cx('player-stage absolute inset-0 transition-opacity', failed && '!opacity-100')} aria-hidden="true" />

      <video
        ref={videoRef}
        key={episode.id}
        src={episode.videoUrl}
        poster={anime.banner}
        playsInline
        preload="metadata"
        className={cx('absolute inset-0 h-full w-full bg-black object-contain', failed && 'opacity-0')}
        onClick={togglePlay}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onPlay={() => {
          setPlaying(true)
          setEnded(false)
        }}
        onPause={() => setPlaying(false)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onEnded={handleEnded}
        onError={() => setFailed(true)}
        aria-label={`${anime.title} — ${episode.number}. bölüm: ${episode.title}`}
      />

      <div className="pointer-events-none absolute right-5 top-5 flex flex-col items-end gap-1 opacity-60">
        <span className="rounded-md bg-black/40 px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-zinc-300 backdrop-blur-md">
          AKARU Yayın
        </span>
        <span className="rounded-md bg-black/40 px-2.5 py-1 text-[11px] font-semibold text-zinc-400 backdrop-blur-md">
          {quality} · {subtitle}
        </span>
      </div>

      {failed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-abyss/80 backdrop-blur-sm">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-akaru-600/15 text-akaru-400">
            <WifiOff className="h-8 w-8" aria-hidden="true" />
          </span>
          <div className="text-center">
            <p className="font-bold text-white">Video yüklenemedi</p>
            <p className="mt-1 text-sm text-zinc-400">
              Bağlantını kontrol et; sorun sürerse bölümü yeniden başlatmayı dene.
            </p>
          </div>
          <button
            type="button"
            onClick={retry}
            className="flex items-center gap-2 rounded-xl bg-akaru-600 px-5 py-2.5 text-sm font-bold text-white shadow-glow-sm transition-colors hover:bg-akaru-500"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Tekrar Dene
          </button>
        </div>
      )}

      {waiting && !failed && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-akaru-500 drop-shadow-[0_0_18px_rgba(249,46,86,0.6)]" aria-label="Yükleniyor" />
        </div>
      )}

      {!playing && !ended && !failed && !waiting && (
        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
          aria-label="Oynat"
        >
          <motion.span
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-akaru-600/90 text-white shadow-glow backdrop-blur-md transition-transform hover:scale-110"
          >
            <Play className="ml-1 h-9 w-9 fill-current" />
          </motion.span>
        </button>
      )}

      {ended && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-black/70 backdrop-blur-sm">
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-400">Bölüm tamamlandı</p>
          <div className="flex flex-wrap items-center justify-center gap-3 px-4">
            <button
              type="button"
              onClick={onPrev}
              disabled={!onPrev}
              className="glass flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-white/12 disabled:opacity-40"
            >
              <SkipBack className="h-4 w-4" aria-hidden="true" />
              Önceki Bölüm
            </button>
            <button
              type="button"
              onClick={() => {
                const v = videoRef.current
                if (!v) return
                v.currentTime = 0
                setEnded(false)
                v.play().catch(() => {})
              }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-akaru-600 text-white shadow-glow-sm transition-colors hover:bg-akaru-500"
              aria-label="Baştan oynat"
            >
              <RotateCw className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={onNext}
              disabled={!onNext}
              className="flex items-center gap-2 rounded-xl bg-akaru-600 px-5 py-3 text-sm font-bold text-white shadow-glow-sm transition-colors hover:bg-akaru-500 disabled:opacity-40"
            >
              Sonraki Bölüm
              <SkipForward className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          {autoplay && onNext && (
            <p className="text-xs text-zinc-500">Otomatik oynatma açıkken sonraki bölüm başlayacak…</p>
          )}
        </div>
      )}

      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/90 via-black/50 to-transparent pb-3 pt-16"
          >
            <div
              className="group/bar relative mx-4 cursor-pointer py-2"
              onClick={handleSeekClick}
              role="slider"
              aria-label="Video konumu"
              aria-valuemin={0}
              aria-valuemax={Math.round(duration)}
              aria-valuenow={Math.round(current)}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight') seekBy(5)
                if (e.key === 'ArrowLeft') seekBy(-5)
              }}
            >
              <div className="relative h-1 rounded-full bg-white/20 transition-all group-hover/bar:h-1.5">
                <div className="absolute inset-y-0 left-0 rounded-full bg-white/25" style={{ width: `${bufferedPct}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-akaru-500" style={{ width: `${progressPct}%` }} />
                <span
                  className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 scale-0 rounded-full bg-akaru-500 shadow-glow-sm transition-transform group-hover/bar:scale-100"
                  style={{ left: `${progressPct}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1 px-4 text-zinc-200">
              <button
                type="button"
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10 hover:text-white"
                aria-label={playing ? 'Duraklat' : 'Oynat'}
              >
                {playing ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
              <button
                type="button"
                onClick={onPrev}
                disabled={!onPrev}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Önceki bölüm"
              >
                <SkipBack className="h-5 w-5 fill-current" />
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={!onNext}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10 hover:text-white disabled:opacity-30"
                aria-label="Sonraki bölüm"
              >
                <SkipForward className="h-5 w-5 fill-current" />
              </button>

              <div className="group/vol flex items-center">
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={muted ? 'Sesi aç' : 'Sessize al'}
                >
                  {effectiveVolume === 0 ? (
                    <VolumeX className="h-5 w-5" />
                  ) : effectiveVolume < 0.5 ? (
                    <Volume1 className="h-5 w-5" />
                  ) : (
                    <Volume2 className="h-5 w-5" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={effectiveVolume}
                  onChange={(e) => {
                    setVolume(Number(e.target.value))
                    setMuted(Number(e.target.value) === 0)
                  }}
                  className="slider w-0 opacity-0 transition-all duration-300 group-hover/vol:w-20 group-hover/vol:opacity-100 focus-visible:w-20 focus-visible:opacity-100"
                  aria-label="Ses seviyesi"
                />
              </div>

              <span className="ml-2 select-none font-mono text-xs font-semibold tabular-nums text-zinc-300">
                {formatTime(current)} <span className="text-zinc-600">/ {formatTime(duration)}</span>
              </span>

              <div className="ml-auto flex items-center">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSettingsOpen((v) => !v)}
                    className={cx(
                      'flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10 hover:text-white',
                      settingsOpen && 'bg-white/10 text-white',
                    )}
                    aria-label="Oynatıcı ayarları"
                    aria-expanded={settingsOpen}
                  >
                    <Settings className="h-5 w-5" />
                  </button>

                  <AnimatePresence>
                    {settingsOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.96 }}
                        transition={{ duration: 0.16 }}
                        className="glass-strong absolute bottom-full right-0 mb-2 w-64 rounded-xl p-3 shadow-card"
                      >
                        <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                          <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
                          Kalite
                        </p>
                        <div className="mb-3 grid grid-cols-2 gap-1.5">
                          {QUALITIES.map((q) => (
                            <button
                              key={q}
                              type="button"
                              onClick={() => selectQuality(q)}
                              className={cx(
                                'flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-bold transition-colors',
                                quality === q
                                  ? 'border-akaru-500/50 bg-akaru-600/20 text-akaru-200'
                                  : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white',
                              )}
                            >
                              {quality === q && <Check className="h-3 w-3" aria-hidden="true" />}
                              {q}
                            </button>
                          ))}
                        </div>

                        <p className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                          <Subtitles className="h-3.5 w-3.5" aria-hidden="true" />
                          Altyazı
                        </p>
                        <div className="mb-3 grid grid-cols-2 gap-1.5">
                          {SUBTITLES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => selectSubtitle(s)}
                              className={cx(
                                'flex items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-bold transition-colors',
                                subtitle === s
                                  ? 'border-akaru-500/50 bg-akaru-600/20 text-akaru-200'
                                  : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white',
                              )}
                            >
                              {subtitle === s && <Check className="h-3 w-3" aria-hidden="true" />}
                              {s}
                            </button>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => setAutoplay((a) => !a)}
                          className="flex w-full items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-zinc-300 transition-colors hover:text-white"
                        >
                          <span className="flex items-center gap-2">
                            <Languages className="h-3.5 w-3.5" aria-hidden="true" />
                            Otomatik Oynatma
                          </span>
                          <span
                            className={cx(
                              'relative h-5 w-9 rounded-full transition-colors',
                              autoplay ? 'bg-akaru-600' : 'bg-white/15',
                            )}
                            aria-hidden="true"
                          >
                            <span
                              className={cx(
                                'absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all',
                                autoplay ? 'left-[18px]' : 'left-0.5',
                              )}
                            />
                          </span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button
                  type="button"
                  onClick={() => setCinema((c) => !c)}
                  className={cx(
                    'hidden h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10 hover:text-white sm:flex',
                    cinema && 'bg-white/10 text-white',
                  )}
                  aria-label="Sinema modu"
                  aria-pressed={cinema}
                  title="Sinema modu (T)"
                >
                  <RectangleHorizontal className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10 hover:text-white"
                  aria-label={fullscreen ? 'Tam ekrandan çık' : 'Tam ekran'}
                >
                  {fullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
