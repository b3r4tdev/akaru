# AKARU

Sinematik anime izleme platformu — koyu tema, kırmızı vurgular ve tamamen özgün bir tasarım diliyle geliştirildi.

## Özellikler

- Öne çıkan animeler için otomatik geçişli hero slider (ken burns efekti, ilerleme göstergeleri)
- Yeni bölümler, popüler animeler, sezon seçkileri ve tür keşfi
- Gelişmiş filtreleme: tür, yıl, durum, sezon, puan, bölüm sayısı ve 5 sıralama seçeneği
- Ctrl+K ile açılan anlık arama (poster, yıl, tür, puan sonuçlarıyla)
- Anime detay sayfası: banner, poster, Japonca/İngilizce adlar, bilgi kartları, sezon sekmeleri, bölüm arama/sıralama, izlendi işaretleme, benzer animeler
- Video oynatıcı: kalite/altyazı seçimi, otomatik oynatma, sinema modu, tam ekran, klavye kısayolları (Space, ←/→, F, T, M)
- İzleme listesi: İzliyorum / İzleyeceğim / Tamamladım / Yarım Bıraktım / Favoriler (localStorage'da saklanır)
- Haftalık yayın takvimi (bugün vurgulu)
- Profil sayfası: izleme istatistikleri, son izlenenler, favoriler, profil düzenleme
- Bildirim sistemi, toast bildirimleri, loading skeleton'ları, 404 sayfası, sayfa geçiş animasyonları
- Tam responsive (mobil / tablet / masaüstü), erişilebilirlik etiketleri, lazy loading

## Teknolojiler

React 18 · Vite 5 · Tailwind CSS 3 · Framer Motion 11 · Lucide React · React Router 6

## Kurulum

```bash
npm install
npm run dev
```

Üretim derlemesi:

```bash
npm run build
npm run preview
```

## Klasör Yapısı

```
src/
├── components/
│   ├── AnimeCard/     # AnimeCard, EpisodeCard, GenreCard
│   ├── Auth/          # LoginModal
│   ├── Footer/
│   ├── Hero/          # Hero slider
│   ├── Logo/
│   ├── Navbar/        # Navbar, MobileMenu, SearchModal, NotificationsDropdown
│   ├── Player/        # VideoPlayer
│   └── ui/            # Button, Badge, Skeleton, EmptyState, ScoreBadge, ...
├── context/           # ToastContext, AuthContext, ListContext
├── data/              # animeData, episodes, notifications, userData (örnek veri katmanı)
├── hooks/             # useLocalStorage, useDebounce, usePageTitle, useScrolled, useClickOutside
├── pages/             # Home, Anime, AnimeDetail, Watch, Genres, Calendar, Profile, MyList, NotFound
├── utils/             # artwork (procedürel SVG poster/banner), formatters, cx
└── assets/
```

## Veri Katmanı

Tüm veri `src/data` altındaki modüllerde tutulur. API'ye geçiş için bu dosyaları fetch tabanlı servislerle değiştirmeniz yeterlidir; bileşenler yalnızca bu fonksiyon imzalarına bağımlıdır:

- `getAnimeById(id)`, `getAnimesWithArt()`, `searchAnimes(query)`, `getNewEpisodes(limit)`, `getSchedule()`, ...

Görseller, deterministik algoritmik SVG'ler olarak `utils/artwork.js` içinde üretilir; gerçek API'ye geçildiğinde `poster`/`banner` alanları URL olarak verilebilir.

## Not

Projedeki tüm anime içerikleri, adlar ve stüdyolar kurgusaldır. Tasarım ve kod tamamen özgün olarak geliştirilmiştir.
