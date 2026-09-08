import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { posterArt } from '@/utils/artwork'
import { cx } from '@/utils/cx'

const GENRE_KEYS = {
  Aksiyon: 'g-aksiyon',
  Macera: 'g-macera',
  Fantastik: 'g-fantastik',
  Romantizm: 'g-romantizm',
  Komedi: 'g-komedi',
  Dram: 'g-dram',
  'Bilim Kurgu': 'g-bilim',
  Shounen: 'g-shounen',
  Isekai: 'g-isekai',
  Korku: 'g-korku',
}

export function GenreCard({ name, count, index = 0 }) {
  const art = posterArt(GENRE_KEYS[name] || name.toLowerCase(), name)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.35) }}
    >
      <Link
        to={`/animeler?tur=${encodeURIComponent(name)}`}
        className="group relative block h-40 overflow-hidden rounded-2xl border border-white/[0.06] bg-elevate shadow-card transition-all duration-300 hover:border-akaru-500/40 hover:shadow-glow-sm sm:h-48"
        aria-label={`${name} türündeki animeler`}
      >
        <img
          src={art}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-t from-akaru-950/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
          <div>
            <h3 className="text-lg font-extrabold text-white sm:text-xl">{name}</h3>
            <p className="mt-0.5 text-sm font-semibold text-zinc-400 transition-colors group-hover:text-akaru-200">
              {count} Anime
            </p>
          </div>
          <span className="flex h-9 w-9 translate-y-1 items-center justify-center rounded-xl bg-white/10 text-zinc-300 opacity-0 backdrop-blur-md transition-all duration-300 group-hover:translate-y-0 group-hover:bg-akaru-600 group-hover:text-white group-hover:opacity-100">
            <ArrowUpRight className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </motion.div>
  )
}
