import { motion } from 'framer-motion'
import { LogoMark } from '@/components/Logo/Logo'

export function LoadingScreen() {
  return (
    <motion.div
      className="noise fixed inset-0 z-[100] flex flex-col items-center justify-center bg-abyss"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      aria-label="AKARU yükleniyor"
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      >
        <LogoMark className="h-20 w-20 drop-shadow-[0_0_30px_rgba(249,46,86,0.7)]" />
      </motion.div>
      <div className="mt-6 overflow-hidden">
        <motion.p
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
          className="text-2xl font-extrabold tracking-[0.4em] text-white"
        >
          AKARU
        </motion.p>
      </div>
      <div className="mt-8 h-[3px] w-44 overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-akaru-600 to-akaru-300"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}
