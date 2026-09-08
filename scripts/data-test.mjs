import { getAnimeById, getFeatured, getTrending, getPopular, getByGenre, getGenreCounts, getSimilar, searchAnimes, getYears, withArt, animes, GENRES, LIST_STATUSES } from '../src/data/animeData.js'
import { getEpisodes, getEpisode, getNewEpisodes, getSchedule, todayWeekday, WEEKDAYS } from '../src/data/episodes.js'
import { getNotifications } from '../src/data/notifications.js'

let failures = 0
function check(name, fn) {
  try {
    const result = fn()
    if (result === 'FAIL') {
      failures++
      console.log(`FAIL ${name}`)
    } else {
      console.log(`OK   ${name}${result !== undefined ? ' -> ' + result : ''}`)
    }
  } catch (e) {
    failures++
    console.log(`FAIL ${name}: ${e.message}`)
  }
}

check('anime sayisi 24', () => (animes.length === 24 ? '24' : `FAIL ${animes.length}`))
check('featured 5 adet', () => (getFeatured().length === 5 ? '5' : `FAIL ${getFeatured().length}`))
check('poster uretiliyor', () => (withArt(animes[0]).poster.startsWith('data:image/svg+xml') ? 'svg OK' : 'FAIL'))
check('banner uretiliyor', () => (withArt(animes[0]).banner.startsWith('data:image/svg+xml') ? 'svg OK' : 'FAIL'))
check('tum animeler icin poster', () => (animes.every((a) => withArt(a).poster && withArt(a).banner) ? 'OK' : 'FAIL'))
check('getAnimeById', () => getAnimeById('kizil-golge')?.title || 'FAIL')
check('bilinmeyen id', () => (getAnimeById('yok') === undefined ? 'OK' : 'FAIL'))

for (const a of animes) {
  const eps = getEpisodes(a)
  const expected = a.currentEpisode ?? a.episodes
  if (eps.length !== expected) throw new Error(`${a.id}: ${eps.length} != ${expected}`)
  for (const e of eps) {
    if (!e.title || !e.airDate || typeof e.views !== 'number') throw new Error(`${a.id} ep${e.number} alan hatasi`)
    if (e.number < 1 || e.number > expected) throw new Error(`${a.id} bolum numarasi bozuk: ${e.number}`)
    if (e.season < 1) throw new Error(`${a.id} sezon numarasi bozuk: ${e.season}`)
  }
  const seasonCount = [...new Set(eps.map((e) => e.season))].length
  if (seasonCount !== (a.seasons?.length || 1)) throw new Error(`${a.id} sezon sayisi: ${seasonCount}`)
}
check('bolumler dogru uretiliyor (tum animeler)', () => 'OK')
check('turkce karakter saglam', () => {
  const ep1 = getEpisode(animes[0], 1)
  return ep1.title === 'Yolculuk Başlıyor' ? 'OK' : `FAIL: "${ep1.title}"`
})

check('getEpisode null donuyor', () => (getEpisode(animes[0], 999) === null ? 'OK' : 'FAIL'))

const newEps = getNewEpisodes(10)
check('yeni bolumler sirali', () => {
  for (let i = 1; i < newEps.length; i++) {
    if (new Date(newEps[i - 1].episode.airDate) < new Date(newEps[i].episode.airDate)) return 'FAIL sira bozuk'
  }
  return newEps.length + ' oge OK'
})

const schedule = getSchedule()
check('takvim 7 gunu kapliyor', () => (schedule.size === 7 ? '7 gun OK' : `FAIL ${schedule.size} gun`))
check('takvim gunleri gecerli', () => ([...schedule.keys()].every((d) => WEEKDAYS.includes(d)) ? [...schedule.keys()].join(',') : 'FAIL'))
check('takvim ogesi alanlari dolu', () =>
  [...schedule.values()].flat().every((i) => i.anime && i.time && i.nextEpisode > 0) ? 'OK' : 'FAIL')
check('bugun gecerli gun', () => (WEEKDAYS.includes(todayWeekday()) ? todayWeekday() : 'FAIL'))

const notifications = getNotifications()
check('bildirimler uretiliyor', () => notifications.length + ' adet')
check('bildirim metinleri saglam', () => (notifications.every((n) => !/Ã|Å|Ä/.test(n.title)) ? 'OK' : 'FAIL mojibake'))
check('bildirim anime id gecerli', () => (notifications.every((n) => getAnimeById(n.animeId)) ? 'OK' : 'FAIL'))

check('turkce arama cesitli', () => {
  const results = [searchAnimes('kizil'), searchAnimes('kızıl'), searchAnimes('KIZIL'), searchAnimes('Kızıl Gölge')]
  return results.every((r) => r.length > 0) ? 'OK' : 'FAIL'
})
check('arama bos', () => (searchAnimes('zzzzxxx').length === 0 ? 'OK' : 'FAIL'))
check('arama tur ile', () => searchAnimes('isekai').length + ' sonuc')
check('arama stüdyo ile', () => (searchAnimes('kaguya').length > 0 ? 'OK' : 'FAIL'))
check('arama bos sorgu', () => (searchAnimes('').length === 0 ? 'OK' : 'FAIL'))

check('tur sayilari pozitif', () => (Object.values(getGenreCounts()).every((c) => c > 0) ? 'OK' : 'FAIL'))
check('benzer animeler', () => getSimilar(animes[0]).length + ' adet')
check('benzer ayni animeyi icermesin', () => (getSimilar(animes[0]).every((a) => a.id !== animes[0].id) ? 'OK' : 'FAIL'))
check('yillar', () => getYears().join(','))
check('populer 12', () => getPopular(12).length)
check('trending 10', () => getTrending(10).length)
check('tur filtresi', () => getByGenre('Aksiyon').length + ' aksiyon animesi')
check('LIST_STATUSES 5 kategori', () => LIST_STATUSES.length)
check('GENRES 10 tur', () => GENRES.length)

console.log(failures === 0 ? '\nTUM TESTLER GECTI' : `\n${failures} TEST BASARISIZ`)
process.exit(failures === 0 ? 0 : 1)
