import { getNewEpisodes } from './episodes.js'
import { animes } from './animeData.js'

function hoursAgo(h) {
  return new Date(Date.now() - h * 3600000).toISOString()
}

export function getNotifications() {
  const [first, second, third] = getNewEpisodes(3)
  const list = []

  if (first) {
    list.push({
      id: 'n1',
      type: 'episode',
      title: `${first.anime.title} ${first.episode.number}. bölüm yayınlandı`,
      detail: 'Yeni bölüm şimdi izlenmeye hazır.',
      time: hoursAgo(0.4),
      animeId: first.anime.id,
    })
  }
  if (second) {
    list.push({
      id: 'n2',
      type: 'favorite',
      title: `Favori listenizdeki ${second.anime.title} güncellendi`,
      detail: `${second.episode.number}. bölüm eklendi.`,
      time: hoursAgo(2),
      animeId: second.anime.id,
    })
  }
  list.push({
    id: 'n3',
    type: 'season',
    title: 'Yeni sezon başladı: Ayın Kapısı',
    detail: '2. Sezon fragmanı yayında.',
    time: hoursAgo(6),
    animeId: 'ayin-kapisi',
  })
  if (third) {
    list.push({
      id: 'n4',
      type: 'episode',
      title: `${third.anime.title} ${third.episode.number}. bölüm yayınlandı`,
      detail: 'Kaçırmayın, yeni bölüm sizi bekliyor.',
      time: hoursAgo(26),
      animeId: third.anime.id,
    })
  }
  const ongoing = animes.find((a) => a.status === 'Devam Ediyor' && a.id !== 'kizil-golge')
  if (ongoing) {
    list.push({
      id: 'n5',
      type: 'season',
      title: `${ongoing.title} yeni sezon onayı aldı`,
      detail: 'Stüdyo resmî duyuruyu yayınladı.',
      time: hoursAgo(49),
      animeId: ongoing.id,
    })
  }
  return list
}
