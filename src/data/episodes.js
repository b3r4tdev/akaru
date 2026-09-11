import { animes } from './animeData.js'

const TITLE_A = [
  'Kırık', 'Gizli', 'Son', 'Kızıl', 'Sessiz', 'Beyaz', 'Kara', 'Yalnız', 'Yükselen',
  'Akan', 'Dönen', 'Uyanan', 'Yanan', 'Donmuş', 'Uzak', 'Derin', 'Vahşi', 'Parlak',
  'Soğuk', 'Kayıp', 'İlk', 'Şafağın', 'Gecenin', 'Kaderin', 'Demir', 'Alevlerin',
]
const TITLE_B = [
  'Yemin', 'Fırtına', 'Kapı', 'Kalp', 'Gölge', 'Kılıç', 'Rüya', 'Şehir', 'Kanat', 'Alev',
  'Buz', 'Yıldız', 'Ay', 'Günbatımı', 'Sır', 'Savaşçı', 'Rota', 'Ada', 'Rüzgar', 'Zafer',
  'Köprü', 'Bahçe', 'Kıyamet', 'Nefes', 'Ayna', 'Zincir', 'Yolculuk', 'Bilgelik',
]

function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildSeasons(anime) {
  if (anime.seasons && anime.seasons.length > 0) {
    const seasons = []
    let from = 1
    anime.seasons.forEach((count, i) => {
      seasons.push({ no: i + 1, title: `Sezon ${i + 1}`, from, to: from + count - 1 })
      from += count
    })
    return seasons
  }
  return [{ no: 1, title: 'Sezon 1', from: 1, to: anime.episodes }]
}

export function getSeasons(anime) {
  return buildSeasons(anime)
}

/**
 * Bölümlere bağlanan örnek video kütüphanesi.
 * Big Buck Bunny ve Sintel: © Blender Foundation, CC-BY 3.0.
 * Flower: CC0 (MDN örnek medyası).
 * Kendi/lisanslı videolarınızla değiştirmek için bu listeyi güncelleyin
 * veya veri katmanını API'ye bağlayın.
 */
export const VIDEO_LIBRARY = [
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_5MB.mp4',
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4',
  'https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_5MB.mp4',
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4',
  'https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_5MB.mp4',
  'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
]

const episodeCache = new Map()

export function getEpisodes(anime) {
  if (episodeCache.has(anime.id)) return episodeCache.get(anime.id)

  const r = mulberry32(hashString(anime.id))
  const seed = hashString(anime.id)
  const total = anime.currentEpisode ?? anime.episodes
  const seasons = buildSeasons(anime)
  const today = new Date()
  today.setHours(18, 0, 0, 0)

  const daysSinceLast = anime.status === 'Devam Ediyor'
    ? Math.floor(r() * 6)
    : 30 + Math.floor(r() * 300)

  const lastAir = new Date(today.getTime() - daysSinceLast * 86400000)
  const episodes = []

  for (const season of seasons) {
    for (let ep = season.from; ep <= season.to; ep++) {
      if (ep > total) break
      const weeksAgo = total - ep
      const airDate = new Date(lastAir.getTime() - weeksAgo * 7 * 86400000)
      const title =
        ep === 1
          ? 'Yolculuk Başlıyor'
          : ep === total && anime.status === 'Tamamlandı'
            ? 'Kaderin Kapısı'
            : `${TITLE_A[Math.floor(r() * TITLE_A.length)]} ${TITLE_B[Math.floor(r() * TITLE_B.length)]}`
      episodes.push({
        id: `${anime.id}-${ep}`,
        animeId: anime.id,
        number: ep,
        season: season.no,
        seasonTitle: season.title,
        title,
        airDate: airDate.toISOString(),
        views: Math.floor(80_000 + r() * 1_450_000),
        duration: anime.duration,
        videoUrl: VIDEO_LIBRARY[(seed + ep) % VIDEO_LIBRARY.length],
      })
    }
  }

  episodes.sort((a, b) => a.number - b.number)
  episodeCache.set(anime.id, episodes)
  return episodes
}

export function getEpisode(anime, number) {
  return getEpisodes(anime).find((e) => e.number === Number(number)) || null
}

export function getNewEpisodes(limit = 10) {
  const items = []
  for (const anime of animes) {
    if (anime.status !== 'Devam Ediyor') continue
    const eps = getEpisodes(anime)
    const latest = eps[eps.length - 1]
    if (latest) items.push({ anime, episode: latest })
  }
  return items.sort((a, b) => new Date(b.episode.airDate).getTime() - new Date(a.episode.airDate).getTime()).slice(0, limit)
}

export const WEEKDAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar']

const calendarCache = new Map()

export function getSchedule() {
  if (calendarCache.size) return calendarCache
  for (const anime of animes) {
    if (anime.status !== 'Devam Ediyor') continue
    const r = mulberry32(hashString(`cal-${anime.id}`))
    const hour = 14 + Math.floor(r() * 8)
    const minute = [0, 15, 30, 45][Math.floor(r() * 4)]
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    const next = (anime.currentEpisode ?? anime.episodes) + 1
    const list = calendarCache.get(anime.airDay) || []
    list.push({ anime, time, nextEpisode: next })
    calendarCache.set(anime.airDay, list)
  }
  for (const list of calendarCache.values()) {
    list.sort((a, b) => a.time.localeCompare(b.time))
  }
  return calendarCache
}

export function todayWeekday() {
  const jsDay = new Date().getDay()
  return WEEKDAYS[(jsDay + 6) % 7]
}
