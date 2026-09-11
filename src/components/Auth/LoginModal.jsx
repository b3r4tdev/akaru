import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2, LogIn, UserPlus, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Logo } from '@/components/Logo/Logo'

export function LoginModal() {
  const { loginOpen, closeLogin, login, register } = useAuth()
  const { toast } = useToast()
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const reset = () => {
    setUsername('')
    setDisplayName('')
    setPassword('')
    setError('')
    setBusy(false)
  }

  const switchMode = (next) => {
    setMode(next)
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    if (busy) return
    setBusy(true)
    setError('')

    const res =
      mode === 'login'
        ? await login(username.trim(), password)
        : await register(username.trim(), displayName.trim(), password)

    if (res.ok) {
      toast(`Hoş geldin, ${res.user.displayName}!`, 'success', 'İzleme listen seni bekliyor.')
      reset()
      closeLogin()
    } else {
      setError(res.error)
      setBusy(false)
    }
  }

  return (
    <AnimatePresence>
      {loginOpen && (
        <motion.div
          className="fixed inset-0 z-[75] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLogin()
          }}
          role="dialog"
          aria-modal="true"
          aria-label={mode === 'login' ? 'Giriş yap' : 'Kayıt ol'}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            className="glass-strong w-full max-w-sm rounded-2xl p-7 shadow-card"
          >
            <div className="mb-6 flex items-start justify-between">
              <Logo />
              <button
                type="button"
                onClick={closeLogin}
                className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 flex rounded-xl bg-white/[0.05] p-1" role="tablist">
              {[
                { key: 'login', label: 'Giriş Yap', icon: LogIn },
                { key: 'register', label: 'Kayıt Ol', icon: UserPlus },
              ].map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={mode === tab.key}
                  onClick={() => switchMode(tab.key)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold transition-all ${
                    mode === tab.key
                      ? 'bg-akaru-600 text-white shadow-glow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" aria-hidden="true" />
                  {tab.label}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-extrabold text-white">
              {mode === 'login' ? 'AKARU hesabına giriş' : 'AKARU’ya katıl'}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {mode === 'login'
                ? 'İzleme listen ve profilin seni bekliyor.'
                : 'Saniyeler içinde hesabını oluştur, listelerini sakla.'}
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="auth-username"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                >
                  Kullanıcı Adı
                </label>
                <input
                  id="auth-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ornek: kizilgece"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-600 transition-colors focus:border-akaru-500/60 focus:outline-none"
                />
              </div>

              {mode === 'register' && (
                <div>
                  <label
                    htmlFor="auth-display"
                    className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                  >
                    Görünen Ad{' '}
                    <span className="font-medium normal-case text-zinc-600">(isteğe bağlı)</span>
                  </label>
                  <input
                    id="auth-display"
                    type="text"
                    autoComplete="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Profilinde görünecek ad"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-600 transition-colors focus:border-akaru-500/60 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                >
                  Şifre
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-600 transition-colors focus:border-akaru-500/60 focus:outline-none"
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-akaru-500/30 bg-akaru-600/10 px-4 py-2.5 text-xs font-semibold text-akaru-200"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-akaru-600 text-sm font-bold text-white shadow-glow-sm transition-all hover:bg-akaru-500 hover:shadow-glow active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : mode === 'login' ? (
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <UserPlus className="h-4 w-4" aria-hidden="true" />
                )}
                {mode === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-600">
              Şifreler bcrypt ile şifrelenip SQLite veritabanında saklanır.
              {mode === 'login' && ' Hesabın yok mu? '}{' '}
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className="font-bold text-akaru-400 hover:text-akaru-300"
                >
                  Kayıt ol
                </button>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
