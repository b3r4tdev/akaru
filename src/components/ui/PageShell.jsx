import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function PageFallback() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-akaru-500" aria-hidden="true" />
      <p className="text-sm text-zinc-400">Sayfa yükleniyor…</p>
    </div>
  )
}

export function PageShell({ children, className = '', bleed = false }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.main>
  )
}
