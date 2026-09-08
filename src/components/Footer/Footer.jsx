import { Link } from 'react-router-dom'
import { Github, Instagram, MessageCircle, Twitter, Youtube } from 'lucide-react'
import { Logo } from '@/components/Logo/Logo'

const SOCIALS = [
  { icon: Twitter, label: 'X (Twitter)' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Youtube, label: 'YouTube' },
  { icon: MessageCircle, label: 'Discord' },
  { icon: Github, label: 'GitHub' },
]

const LINK_GROUPS = [
  {
    title: 'Keşfet',
    links: [
      { to: '/', label: 'Ana Sayfa' },
      { to: '/animeler', label: 'Animeler' },
      { to: '/turler', label: 'Türler' },
      { to: '/takvim', label: 'Takvim' },
    ],
  },
  {
    title: 'Hesap',
    links: [
      { to: '/profil', label: 'Profilim' },
      { to: '/listem', label: 'İzleme Listem' },
      { to: '/animeler?siralama=populer', label: 'Popüler Animeler' },
      { to: '/animeler?siralama=yeni', label: 'Yeni Bölümler' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/[0.06] bg-abyss">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-akaru-600/60 to-transparent" aria-hidden="true" />
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-zinc-500">
              Sinematik anime deneyimi. Özgün tasarımı, akıcı arayüzü ve kişisel izleme
              sistemiyle binlerce bölüm tek bir çatı altında.
            </p>
            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-zinc-400 transition-all hover:border-akaru-500/40 hover:text-akaru-300"
                >
                  <s.icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {LINK_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm font-medium text-zinc-500 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Yasal</h3>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm font-medium text-zinc-500 transition-colors hover:text-white"
                >
                  Gizlilik Politikası
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm font-medium text-zinc-500 transition-colors hover:text-white"
                >
                  Kullanım Koşulları
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-sm font-medium text-zinc-500 transition-colors hover:text-white"
                >
                  İletişim
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-7 sm:flex-row">
          <p className="text-xs text-zinc-600">© 2026 AKARU. Tüm hakları saklıdır.</p>
          <p className="text-xs text-zinc-700">Tasarım ve içerik tamamen özgün olarak geliştirilmiştir.</p>
        </div>
      </div>
    </footer>
  )
}
