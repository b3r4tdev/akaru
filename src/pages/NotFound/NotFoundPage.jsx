import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PageShell } from '@/components/ui/PageShell'
import { usePageTitle } from '@/hooks/usePageTitle'

export default function NotFoundPage() {
  usePageTitle('Sayfa Bulunamadı')
  return (
    <PageShell className="noise relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4">
      <div
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-akaru-600/15 blur-[120px]"
        aria-hidden="true"
      />
      <motion.p
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-gradient text-[8rem] font-black leading-none sm:text-[12rem]"
        aria-hidden="true"
      >
        404
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative z-10 text-center"
      >
        <h1 className="text-xl font-extrabold text-white sm:text-2xl">
          Aradığın sayfa kayıp bir anime gibi
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">
          Sayfa taşınmış, kaldırılmış ya da hiç var olmamış olabilir. Ama üzülme,
          geri dönmek için harika bir butonumuz var.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/" size="lg">
            <Home className="h-5 w-5" aria-hidden="true" />
            Ana Sayfaya Dön
          </Button>
          <Button to="/animeler" variant="secondary" size="lg">
            <SearchX className="h-5 w-5" aria-hidden="true" />
            Animeleri Keşfet
          </Button>
        </div>
        <p className="mt-10 text-xs text-zinc-700">
          Hata kodu: <span className="font-mono text-zinc-600">AKARU/404/NOT_FOUND</span>
        </p>
      </motion.div>
      <Link
        to="/"
        className="absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-90 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-800 transition-colors hover:text-akaru-500 lg:block"
      >
        AKARU — SINEMATİK ANİME DENEYİMİ
      </Link>
    </PageShell>
  )
}
