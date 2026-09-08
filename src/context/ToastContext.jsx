import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'

const ToastContext = createContext(null)
let toastId = 0

const ICONS = {
  success: CheckCircle2,
  info: Info,
  error: AlertTriangle,
}

const STYLES = {
  success: { icon: 'text-emerald-400', bar: 'bg-emerald-400' },
  info: { icon: 'text-sky-400', bar: 'bg-sky-400' },
  error: { icon: 'text-akaru-400', bar: 'bg-akaru-500' },
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef({})

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
    if (timers.current[id]) {
      clearTimeout(timers.current[id])
      delete timers.current[id]
    }
  }, [])

  const toast = useCallback(
    (message, type = 'info', description = '') => {
      const id = ++toastId
      setToasts((list) => [...list.slice(-3), { id, message, type, description }])
      timers.current[id] = setTimeout(() => dismiss(id), 3400)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-3 top-20 z-[90] flex w-[calc(100vw-1.5rem)] max-w-sm flex-col gap-2 sm:right-5"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] || Info
            const style = STYLES[t.type] || STYLES.info
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className="glass-strong pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl p-3.5 pr-9 shadow-card"
              >
                <span className={`absolute inset-y-0 left-0 w-1 ${style.bar}`} aria-hidden="true" />
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${style.icon}`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{t.message}</p>
                  {t.description && <p className="mt-0.5 text-xs text-zinc-400">{t.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="absolute right-2.5 top-2.5 rounded-md p-1 text-zinc-500 transition hover:bg-white/10 hover:text-white"
                  aria-label="Bildirimi kapat"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
