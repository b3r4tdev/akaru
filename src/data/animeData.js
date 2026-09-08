import { posterArt, bannerArt } from '../utils/artwork.js'

export const GENRES = [
  { name: 'Aksiyon', icon: 'Swords' },
  { name: 'Macera', icon: 'Compass' },
  { name: 'Fantastik', icon: 'Wand2' },
  { name: 'Romantizm', icon: 'Heart' },
  { name: 'Komedi', icon: 'Laugh' },
  { name: 'Dram', icon: 'Drama' },
  { name: 'Bilim Kurgu', icon: 'Rocket' },
  { name: 'Shounen', icon: 'Zap' },
  { name: 'Isekai', icon: 'DoorOpen' },
  { name: 'Korku', icon: 'Ghost' },
]

export const STATUSES = ['Devam Ediyor', 'Yakında', 'Tamamlandı']
export const SEASONS = ['Kış', 'İlkbahar', 'Yaz', 'Sonbahar']

export const animes = [
  {
    id: 'kizil-golge',
    title: 'Kızıl Gölge',
    japaneseTitle: '紅影 ‐AKAKAGE‐',
    englishTitle: 'Crimson Shade',
    description:
      'Sessizlik Şehri’ni koruyan gölge savaşçıların son temsilcisi Ren, kızıl bir hayalet tarafından işaretlenen gecede kaderiyle yüzleşir. Elinde annesinden kalan kırık kılıç ve omzunda yüzyıllık bir lanetle, kendi kökenine dair sarsıcı gerçeği ortaya çıkarmak üzere yola düşer.',
    genres: ['Aksiyon', 'Fantastik', 'Shounen'],
    score: 9.1,
    year: 2025,
    season: 'Ilkbahar',
    episodes: 24,
    currentEpisode: 18,
    status: 'Devam Ediyor',
    studio: 'Studio Kaguya',
    duration: 24,
    type: 'TV',
    ageRating: '16+',
    airDay: 'Pazartesi',
    popularity: 98,
    featured: true,
    trending: true,
    addedDaysAgo: 3,
  },
  {
    id: 'firtina-kusu',
    title: 'Fırtına Kuşu',
    japaneseTitle: '嵐鳥',
    englishTitle: 'Stormbird',
    description:
      'Gökyüzü kabilelerinin son umudu olan yıldırım kuşu Arashi, insanlığı yok olmanın eşiğinden döndürmek için efsanevi Fırtına Kıtası’na doğru kanat çırpıyor. Yolculuğunda ihanet, dostluk ve kan bağına dair sırlarla boğuşacak; fırtınanın kalbinde kendi adını yazdıracak.',
    genres: ['Aksiyon', 'Shounen', 'Macera'],
    score: 8.9,
    year: 2024,
    season: 'Yaz',
    episodes: 36,
    status: 'Tamamlandı',
    seasons: [12, 12, 12],
    studio: 'Hyperion Animation',
    duration: 24,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Cumartesi',
    popularity: 95,
    featured: true,
    trending: true,
    addedDaysAgo: 42,
  },
  {
    id: 'yildiz-kirigi',
    title: 'Yıldız Kırığı',
    japaneseTitle: '星砕き',
    englishTitle: 'Starshatter',
    description:
      '2149’da Dünya’nın uydusu parçalanmıştır ve gökten düşen yıldız kırıkları, taşıyanlara acı verici güçler bahşeder. Kırık taşı kalbinde taşıyan Hoshimi, avcılardan kaçarken bir yandan da gökyüzünü yeniden birleştirecek cevabın peşine düşer.',
    genres: ['Bilim Kurgu', 'Dram', 'Aksiyon'],
    score: 8.8,
    year: 2024,
    season: 'Sonbahar',
    episodes: 25,
    status: 'Tamamlandı',
    seasons: [13, 12],
    studio: 'Nova Works',
    duration: 24,
    type: 'TV',
    ageRating: '16+',
    airDay: 'Çarşamba',
    popularity: 93,
    featured: true,
    trending: true,
    addedDaysAgo: 15,
  },
  {
    id: 'ayin-kapisi',
    title: 'Ayın Kapısı',
    japaneseTitle: '月門',
    englishTitle: 'Gate of the Moon',
    description:
      'Her dolunayda açılan gizemli kapı, sıradan bir lise öğrencisi olan Yuki’yi ay tanrılarının hüküm sürdüğü Tsukiyo diyarına sürükler. Dünyaya geri dönebilmek için on iki ay çekirdeğini toplaması gerekir; ama her çekirdek, unutmak istediği bir anısının bedeli.',
    genres: ['Fantastik', 'Isekai', 'Macera'],
    score: 8.6,
    year: 2025,
    season: 'Kış',
    episodes: 12,
    currentEpisode: 9,
    status: 'Devam Ediyor',
    studio: 'Studio Kaguya',
    duration: 24,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Perşembe',
    popularity: 91,
    featured: true,
    trending: true,
    addedDaysAgo: 5,
  },
  {
    id: 'sessiz-kanatlar',
    title: 'Sessiz Kanatlar',
    japaneseTitle: '静かな翼',
    englishTitle: 'Silent Wings',
    description:
      'Şarkı söyleyerek iletişim kuran bir kuş kızla, sesini bir kaza sonrası kaybetmiş bir piyanist arasındaki imkansız bağ, iki dünyayı birbirine yaklaştırır. Sesin değil kalbin duyduğu şeyleri anlatan sessiz bir aşk hikâyesi.',
    genres: ['Romantizm', 'Dram'],
    score: 8.4,
    year: 2023,
    season: 'İlkbahar',
    episodes: 13,
    status: 'Tamamlandı',
    studio: 'Mavi Çizgi',
    duration: 23,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Salı',
    popularity: 86,
    featured: true,
    addedDaysAgo: 210,
  },
  {
    id: 'demir-cicek',
    title: 'Demir Çiçek',
    japaneseTitle: '鉄華',
    englishTitle: 'Iron Bloom',
    description:
      'Savaşın orta yerinde açan tek şey ölümdü; ta ki zırh ustası Tetsu’nin dövdiği ilk demir çiçek ağlayana kadar. Barış için savaşan bir demirci kızın, ordularını çiçeklere çeviren gizli bir sanatı keşfetme yolculuğu.',
    genres: ['Aksiyon', 'Macera', 'Fantastik'],
    score: 8.7,
    year: 2025,
    season: 'Kış',
    episodes: 12,
    currentEpisode: 10,
    status: 'Devam Ediyor',
    studio: 'Ronin Studio',
    duration: 24,
    type: 'TV',
    ageRating: '16+',
    airDay: 'Çarşamba',
    popularity: 89,
    trending: true,
    addedDaysAgo: 2,
  },
  {
    id: 'sonsuz-bahce',
    title: 'Sonsuz Bahçe',
    japaneseTitle: '永遠の庭',
    englishTitle: 'Eternal Garden',
    description:
      'Ölülerin anılarının çiçeğe dönüştüğü bir bahçeye gözünü açan Ella, burada zamanın hiç akmadığını fark eder. Kendi anısını hatırlayabilmek için bahçenin bekçileriyle pazarlık ederken, sonsuzluğun bedelini öğrenir.',
    genres: ['Isekai', 'Fantastik', 'Dram'],
    score: 8.2,
    year: 2024,
    season: 'Sonbahar',
    episodes: 24,
    status: 'Tamamlandı',
    studio: 'Yeşil Perde',
    duration: 24,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Pazar',
    popularity: 78,
    addedDaysAgo: 120,
  },
  {
    id: 'gece-savascilari',
    title: 'Gece Savaşçıları',
    japaneseTitle: '夜の戦士',
    englishTitle: 'Night Warriors',
    description:
      'Gündüz insan, gece avcı. Şehirdeki kayıpların ardındaki karanlık tarikata karşı kurulan gizli birlik, kendi içlerindeki canavarla savaşmayı da öğrenmelidir. Çünkü gölgede kalan her savaşçı, bir gün avlanan tarafa geçebilir.',
    genres: ['Aksiyon', 'Korku', 'Shounen'],
    score: 8.5,
    year: 2024,
    season: 'İlkbahar',
    episodes: 24,
    status: 'Tamamlandı',
    studio: 'Karanlık Atölye',
    duration: 24,
    type: 'TV',
    ageRating: '18+',
    airDay: 'Cuma',
    popularity: 84,
    trending: true,
    addedDaysAgo: 95,
  },
  {
    id: 'kristal-kalp',
    title: 'Kristal Kalp',
    japaneseTitle: '結晶心',
    englishTitle: 'Crystal Heart',
    description:
      'Kalbi camdan bir kız, dokunduğu her şeyi kıracağından korkarak yaşarken, kırmadan tutabildiği tek kişiye âşık olur. Kırılganlığın güce dönüştüğü, tebessüm ve gözyaşının bir arada aktığı bir gençlik hikâyesi.',
    genres: ['Romantizm', 'Komedi'],
    score: 7.9,
    year: 2025,
    season: 'Ilkbahar',
    episodes: 12,
    currentEpisode: 7,
    status: 'Devam Ediyor',
    studio: 'Mavi Çizgi',
    duration: 23,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Cumartesi',
    popularity: 74,
    addedDaysAgo: 8,
  },
  {
    id: 'alev-kitasi',
    title: 'Alev Kıtası',
    japaneseTitle: '焔州',
    englishTitle: 'Blaze Continent',
    description:
      'Beş ateş klanının paylaşamadığı kıtada, sönmüş bir alevi yeniden tutuşturabilecek tek kıvılcım bir yetimdedir. Kağan’ın yükselişi, klanların bin yıllık kiniyle sınanacak; kıta ya yanacak ya da yeniden doğacak.',
    genres: ['Shounen', 'Aksiyon', 'Macera'],
    score: 9.0,
    year: 2023,
    season: 'Yaz',
    episodes: 50,
    status: 'Tamamlandı',
    seasons: [25, 25],
    studio: 'Hyperion Animation',
    duration: 24,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Perşembe',
    popularity: 96,
    trending: true,
    addedDaysAgo: 300,
  },
  {
    id: 'ruzgarin-oglu',
    title: 'Rüzgarın Oğlu',
    japaneseTitle: '風の子',
    englishTitle: 'Child of Wind',
    description:
      'Rüzgârın hiç dinmediği uçsuz stepte büyüyen Kazé, köyünü kasıp kavuran fırtınanın kaynağını bulmak için göğe doğru yelken açar. Yol boyunca bulduğu her cevap, ona rüzgârın aslında bir ninni olduğunu fısıldar.',
    genres: ['Macera', 'Komedi', 'Fantastik'],
    score: 8.1,
    year: 2023,
    season: 'İlkbahar',
    episodes: 26,
    status: 'Tamamlandı',
    seasons: [13, 13],
    studio: 'Studio Kaguya',
    duration: 24,
    type: 'TV',
    ageRating: '7+',
    airDay: 'Cumartesi',
    popularity: 72,
    addedDaysAgo: 260,
  },
  {
    id: 'kaderin-carki',
    title: 'Kaderin Çarkı',
    japaneseTitle: '運命の歯車',
    englishTitle: 'Wheel of Fate',
    description:
      'Bir demirci kızı ile gölgeli bir prensesin yolları, her yüzyılda bir kez dönen kader çarkının tam ortasında kesişir. Çarkı çevirebilen tek şey bir bedel ister: en değer verdiklerinizi hatırlamak.',
    genres: ['Dram', 'Fantastik', 'Romantizm'],
    score: 8.6,
    year: 2025,
    season: 'Kış',
    episodes: 12,
    currentEpisode: 11,
    status: 'Devam Ediyor',
    studio: 'Gece Yarısı Stüdyosu',
    duration: 25,
    type: 'TV',
    ageRating: '16+',
    airDay: 'Salı',
    popularity: 83,
    trending: true,
    addedDaysAgo: 1,
  },
  {
    id: 'kuller-sehri',
    title: 'Küller Şehri',
    japaneseTitle: '灰の都',
    englishTitle: 'City of Ash',
    description:
      'Büyük Yangın’dan geriye yalnızca küller ve hatırlamayan insanlar kaldı. Bellek tüccarı Asha, şehrin altında yanan gerçekle yüzleşmek için kendi geçmişini satmak zorunda kalır. Unutmak, bazen hayatta kalmanın tek yoludur.',
    genres: ['Bilim Kurgu', 'Aksiyon', 'Korku'],
    score: 8.8,
    year: 2024,
    season: 'Sonbahar',
    episodes: 24,
    status: 'Tamamlandı',
    studio: 'Nova Works',
    duration: 24,
    type: 'TV',
    ageRating: '18+',
    airDay: 'Çarşamba',
    popularity: 90,
    addedDaysAgo: 60,
  },
  {
    id: 'buyulu-kalem',
    title: 'Büyülü Kalem',
    japaneseTitle: '魔筆',
    englishTitle: 'Enchanted Pen',
    description:
      'Çizdiği her şeyin gerçeğe dönüştüğü büyülü bir kalem, içine kapanık bir öğrencinin sırt çantasına düşer. Sorun şu ki, kalem yalnızca sahibinin gizli hislerini çizer — ve kâbuslar dahil.',
    genres: ['Fantastik', 'Komedi', 'Macera'],
    score: 7.8,
    year: 2023,
    season: 'İlkbahar',
    episodes: 24,
    status: 'Tamamlandı',
    studio: 'Yeşil Perde',
    duration: 23,
    type: 'TV',
    ageRating: '7+',
    airDay: 'Pazar',
    popularity: 65,
    addedDaysAgo: 340,
  },
  {
    id: 'kayip-takvim',
    title: 'Kayıp Takvim',
    japaneseTitle: '失われた暦',
    englishTitle: 'Lost Calendar',
    description:
      'Dünyadan bir yıl kaybolur ve kimse fark etmez — Haruki hariç. Elinde 365 boş sayfa, peşinde zamanı satan bir tarikat olan genç bir arşivci, kayıp yılı geri getirmek için takvimin yapraklarını yeniden doldurmalıdır.',
    genres: ['Dram', 'Bilim Kurgu', 'Isekai'],
    score: 8.3,
    year: 2024,
    season: 'Kış',
    episodes: 12,
    status: 'Tamamlandı',
    studio: 'Gece Yarısı Stüdyosu',
    duration: 24,
    type: 'TV',
    ageRating: '16+',
    airDay: 'Salı',
    popularity: 71,
    addedDaysAgo: 190,
  },
  {
    id: 'zaman-firtinasi',
    title: 'Zaman Fırtınası',
    japaneseTitle: '時の嵐',
    englishTitle: 'Tempest of Time',
    description:
      'Saniyeleri çalabilen bir saatten güç alan Chrono, zamanın paramparça olduğu bir çağda avlanan son zaman yolcusudur. Her kurtardığı an, gelecekte bir fırtınayı büyütür; çünkü zaman asla bağışlamaz.',
    genres: ['Aksiyon', 'Bilim Kurgu', 'Macera'],
    score: 8.0,
    year: 2025,
    season: 'Ilkbahar',
    episodes: 12,
    currentEpisode: 5,
    status: 'Devam Ediyor',
    studio: 'Nova Works',
    duration: 24,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Cuma',
    popularity: 76,
    trending: true,
    addedDaysAgo: 6,
  },
  {
    id: 'buz-kralligi',
    title: 'Buz Krallığı',
    japaneseTitle: '氷の王国',
    englishTitle: 'Kingdom of Ice',
    description:
      'Bin yıllık kışın hüküm sürdüğü krallıkta, kalbi asla donmayan bir çocuk prenses tahtın gerçek mirasçısı olduğunu öğrenir. Buzla sarılmış bir dünyada sıcak kalmanın en zor savaşı başlıyor.',
    genres: ['Fantastik', 'Macera', 'Dram'],
    score: 8.5,
    year: 2023,
    season: 'Sonbahar',
    episodes: 24,
    status: 'Tamamlandı',
    studio: 'Ronin Studio',
    duration: 24,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Perşembe',
    popularity: 80,
    addedDaysAgo: 280,
  },
  {
    id: 'ejder-ninnisi',
    title: 'Ejder Ninnisi',
    japaneseTitle: '竜の子守唄',
    englishTitle: 'Dragon Lullaby',
    description:
      'Ejderhaların soyu tükenmeden önce, son yavruyu uyutan bir ninni gerekir. Ninniyi bilen tek kişi, kelimeleri unutmuş eski bir ozandır. Yolculuğu, dünyanın en son ejder uykusuna eşlik edecek.',
    genres: ['Fantastik', 'Shounen', 'Aksiyon'],
    score: 8.9,
    year: 2025,
    season: 'Ilkbahar',
    episodes: 12,
    currentEpisode: 6,
    status: 'Devam Ediyor',
    studio: 'Studio Kaguya',
    duration: 24,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Pazartesi',
    popularity: 92,
    trending: true,
    addedDaysAgo: 4,
  },
  {
    id: 'golgeler-okulu',
    title: 'Gölgeler Okulu',
    japaneseTitle: '影の学園',
    englishTitle: 'Academy of Shadows',
    description:
      'Gölge sanatlarının öğretildiği gizli bir yatılı okulda, kendi gölgesiyle konuşabilen yeni öğrenci Kage, okulun geçmişinde gömülü bir cinayetin izini sürer. Bu okulda derslerden tehlikeli olan tek şey gece yürüyüşleri değil.',
    genres: ['Korku', 'Aksiyon', 'Shounen'],
    score: 8.1,
    year: 2024,
    season: 'Yaz',
    episodes: 24,
    status: 'Tamamlandı',
    studio: 'Karanlık Atölye',
    duration: 24,
    type: 'TV',
    ageRating: '16+',
    airDay: 'Çarşamba',
    popularity: 70,
    addedDaysAgo: 130,
  },
  {
    id: 'hancerin-safagi',
    title: 'Hançerin Şafağı',
    japaneseTitle: '短剣の夜明け',
    englishTitle: "Dagger's Dawn",
    description:
      'Kırık Hançer Tarikatı’nın yetiştirdiği genç suikastçı Yoru, son görevinde hedefi olarak verilen kişiyi tanır: kendini yetiştiren ustası. Hançerini kime çevireceğini şafak sökmeye karar kılacak.',
    genres: ['Aksiyon', 'Dram', 'Shounen'],
    score: 8.7,
    year: 2024,
    season: 'Kış',
    episodes: 24,
    status: 'Tamamlandı',
    studio: 'Ronin Studio',
    duration: 24,
    type: 'TV',
    ageRating: '18+',
    airDay: 'Cumartesi',
    popularity: 82,
    addedDaysAgo: 170,
  },
  {
    id: 'mor-simsek',
    title: 'Mor Şimşek',
    japaneseTitle: '紫電',
    englishTitle: 'Violet Lightning',
    description:
      'Mor şimşeklerin düştüğü gecelerde elektriğe dönüşen bir kız, kendini onu yakalamaya gelen enerji şirketinin ordusundan kaçarken bulur. Vücudundaki güç, dünyanın en büyük enerji krizinin anahtarıdır.',
    genres: ['Aksiyon', 'Bilim Kurgu', 'Shounen'],
    score: 8.4,
    year: 2023,
    season: 'Sonbahar',
    episodes: 26,
    status: 'Tamamlandı',
    seasons: [13, 13],
    studio: 'Hyperion Animation',
    duration: 24,
    type: 'TV',
    ageRating: '13+',
    airDay: 'Cuma',
    popularity: 77,
    addedDaysAgo: 320,
  },
  {
    id: 'beyaz-kurt-kanunu',
    title: 'Beyaz Kurt Kanunu',
    japaneseTitle: '白狼の掟',
    englishTitle: "White Wolf's Law",
    description:
      'Kuzeyin dondurucu bozkırlarında, kurt sürülerinin kaldırdığı tek kanun güçtür. Sürüsünü kaybetmiş beyaz bir kurt tarafından büyütülen genç avcı Shiro, insanlar ve sürüler arasındaki kırılgan barışın son çizgisi olur.',
    genres: ['Macera', 'Aksiyon', 'Dram'],
    score: 8.2,
    year: 2025,
    season: 'Kış',
    episodes: 12,
    currentEpisode: 8,
    status: 'Devam Ediyor',
    studio: 'Karanlık Atölye',
    duration: 24,
    type: 'TV',
    ageRating: '16+',
    airDay: 'Pazar',
    popularity: 68,
    addedDaysAgo: 7,
  },
  {
    id: 'inci-firtinasi',
    title: 'İnci Fırtınası',
    japaneseTitle: '真珠嵐',
    englishTitle: 'Pearl Storm',
    description:
      'Deniz kızlarının incileri ağlattığı bir sahil kasabasında, tekne tamircisi bir kızla denizin altından gelen bir misafir arasındaki dostluk, kasabayı yüzyılda bir yaşanan inci fırtınasına karşı hazırlar.',
    genres: ['Romantizm', 'Dram', 'Komedi'],
    score: 7.7,
    year: 2024,
    season: 'İlkbahar',
    episodes: 13,
    status: 'Tamamlandı',
    studio: 'Mavi Çizgi',
    duration: 23,
    type: 'TV',
    ageRating: '7+',
    airDay: 'Salı',
    popularity: 61,
    addedDaysAgo: 150,
  },
  {
    id: 'ayna-dunyasi',
    title: 'Ayna Dünyası',
    japaneseTitle: '鏡界',
    englishTitle: 'Mirror World',
    description:
      'Kırık bir aynadan içeri düşen Kagami, kendisinin tam tersi bir ayna kopyasıyla yer değiştirmiştir. Gerçek dünyaya dönebilmesi için kendi kopyasıyla oyun oynaması — ve kazanması gerekir. Kaybeden, sonsuza kadar yansımada kalır.',
    genres: ['Isekai', 'Bilim Kurgu', 'Aksiyon'],
    score: 8.3,
    year: 2025,
    season: 'Ilkbahar',
    episodes: 12,
    currentEpisode: 3,
    status: 'Devam Ediyor',
    studio: 'Yeşil Perde',
    duration: 24,
    type: 'TV',
    ageRating: '16+',
    airDay: 'Perşembe',
    popularity: 73,
    trending: true,
    addedDaysAgo: 1,
  },
]

const byId = new Map(animes.map((a) => [a.id, a]))

export function getAnimeById(id) {
  return byId.get(id)
}

export function withArt(anime) {
  return {
    ...anime,
    poster: posterArt(anime.id, anime.title, anime.japaneseTitle),
    banner: bannerArt(anime.id, anime.title, anime.japaneseTitle),
  }
}

export function getAnimesWithArt() {
  return animes.map(withArt)
}

export function getFeatured() {
  return animes.filter((a) => a.featured).map(withArt)
}

export function getTrending(limit = 10) {
  return animes
    .filter((a) => a.trending)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map(withArt)
}

export function getPopular(limit = 12) {
  return animes
    .slice()
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map(withArt)
}

export function getByGenre(genre, limit = Infinity) {
  return animes
    .filter((a) => a.genres.includes(genre))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
    .map(withArt)
}

export function getGenreCounts() {
  const counts = {}
  for (const g of GENRES) {
    counts[g.name] = animes.filter((a) => a.genres.includes(g.name)).length
  }
  return counts
}

export function getSimilar(anime, limit = 6) {
  return animes
    .filter((a) => a.id !== anime.id)
    .map((a) => ({ a, score: a.genres.filter((g) => anime.genres.includes(g)).length }))
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || y.a.popularity - x.a.popularity)
    .slice(0, limit)
    .map((x) => withArt(x.a))
}

function normalizeTr(str) {
  return str
    .toLocaleLowerCase('tr')
    .replaceAll('ı', 'i')
    .replaceAll('İ', 'i')
    .replaceAll('ş', 's')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c')
    .replaceAll('â', 'a')
}

export function searchAnimes(query) {
  const q = normalizeTr(query || '')
  if (!q.trim()) return []
  return animes
    .filter((a) =>
      [
        a.title,
        a.englishTitle,
        a.japaneseTitle,
        a.studio,
        a.genres.join(' '),
      ].some((field) => normalizeTr(field).includes(q)),
    )
    .slice(0, 12)
    .map(withArt)
}

export function getYears() {
  return [...new Set(animes.map((a) => a.year))].sort((a, b) => b - a)
}

export const LIST_STATUSES = [
  { key: 'watching', label: 'İzliyorum', icon: 'PlayCircle' },
  { key: 'planned', label: 'İzleyeceğim', icon: 'Clock' },
  { key: 'completed', label: 'Tamamladım', icon: 'CheckCircle2' },
  { key: 'dropped', label: 'Yarım Bıraktım', icon: 'XCircle' },
  { key: 'favorites', label: 'Favoriler', icon: 'Heart' },
]
