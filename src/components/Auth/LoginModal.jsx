import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogIn, X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { Logo } from '@/components/Logo/Logo'

export function LoginModal() {
  const { loginOpen, closeLogin, login } = useAuth()
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (login(username, displayName)) {
      toast(`Hoş geldin, ${username.trim()}!`, 'success', 'İzleme listen seni bekliyor.')
      closeLogin()
      setUsername('')
      setDisplayName('')
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
          aria-label="Giriş yap"
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

            <h2 className="text-xl font-extrabold text-white">AKARU'ya giriş yap</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Listelerini, izleme geçmişini ve bildirimlerini senkronize et.
            </p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="login-username"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                >
                  Kullanıcı Adı
                </label>
                <input
                  id="login-username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ornek: kizilgece"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-600 transition-colors focus:border-akaru-500/60 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="login-display"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-zinc-500"
                >
                  Görünen Ad <span className="font-medium normal-case text-zinc-600">(isteğe bağlı)</span>
                </label>
                <input
                  id="login-display"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Profilinde görünecek ad"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white placeholder:text-zinc-600 transition-colors focus:border-akaru-500/60 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-akaru-600 text-sm font-bold text-white shadow-glow-sm transition-all hover:bg-akaru-500 hover:shadow-glow active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                Giriş Yap
              </button>
            </form>

            <p className="mt-5 text-center text-[11px] leading-relaxed text-zinc-600">
              Bu, örnek verilerle çalışan bir demo oturumdur. Bilgiler yalnızca bu tarayıcıda saklanır.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
