const artCache = new Map()

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

const PALETTES = [
  ['#150709', '#3f0d1d', '#ff2e55'],
  ['#0d0714', '#2b1048', '#9a5cff'],
  ['#071014', '#0c2f3f', '#2fc8ff'],
  ['#140a06', '#40260c', '#ffae34'],
  ['#07120b', '#0d3a24', '#37e08f'],
  ['#12060c', '#380d2e', '#ff5ca8'],
  ['#060612', '#101c42', '#6b8bff'],
  ['#120607', '#3c1010', '#ff7038'],
]

function toUri(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s{2,}/g, ' '))}`
}

function ringItems(r, w, h) {
  const items = []
  const count = 2 + Math.floor(r() * 2)
  for (let i = 0; i < count; i++) {
    items.push(
      `<circle cx="${Math.round(r() * w)}" cy="${Math.round(r() * h)}" r="${Math.round(
        h * (0.12 + r() * 0.25),
      )}" fill="none" stroke="${'rgba(255,255,255,0.07)'}" stroke-width="1.5"/>`,
    )
  }
  return items.join('')
}

function streakItems(r, w, h, accent) {
  const items = []
  const count = 2 + Math.floor(r() * 3)
  const angle = Math.round(r() * 40 - 20)
  for (let i = 0; i < count; i++) {
    const x = Math.round(r() * w)
    items.push(
      `<line x1="${x}" y1="-${h}" x2="${x + h}" y2="${h}" stroke="${accent}" stroke-opacity="0.14" stroke-width="${
        2 + Math.round(r() * 5)
      }" transform="rotate(${angle} ${w / 2} ${h / 2})"/>`,
    )
  }
  return items.join('')
}

export function posterArt(seedKey, title, japaneseTitle = '') {
  const key = `p:${seedKey}`
  if (artCache.has(key)) return artCache.get(key)

  const seed = hashString(seedKey)
  const r = mulberry32(seed)
  const [c0, c1, c2] = PALETTES[seed % PALETTES.length]
  const W = 400
  const H = 600
  const jp = (japaneseTitle || '').replace(/[‐\-—\s]/g, '').slice(0, 4)
  const letter = (title || 'A').trim().charAt(0).toUpperCase()

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c0}"/>
        <stop offset="0.55" stop-color="${c1}"/>
        <stop offset="1" stop-color="${c0}"/>
      </linearGradient>
      <radialGradient id="glow" cx="0.3" cy="0.25" r="0.9">
        <stop offset="0" stop-color="${c2}" stop-opacity="0.5"/>
        <stop offset="1" stop-color="${c2}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="vig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.6" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="0.55"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    ${ringItems(r, W, H)}
    ${streakItems(r, W, H, c2)}
    <text x="${W / 2}" y="${H / 2 + 60}" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="230" font-weight="800" fill="#ffffff" fill-opacity="0.08">${letter}</text>
    ${
      jp
        ? `<text x="${W - 34}" y="52" text-anchor="middle" font-family="'Yu Gothic', 'MS Gothic', sans-serif" font-size="42" fill="#ffffff" fill-opacity="0.22">${jp}</text>`
        : ''
    }
    <rect y="${H - 120}" width="${W}" height="120" fill="#000" opacity="0.35"/>
    <rect width="${W}" height="${H}" fill="url(#vig)"/>
  </svg>`

  const uri = toUri(svg)
  artCache.set(key, uri)
  return uri
}

export function bannerArt(seedKey, title, japaneseTitle = '') {
  const key = `b:${seedKey}`
  if (artCache.has(key)) return artCache.get(key)

  const seed = hashString(seedKey)
  const r = mulberry32(seed)
  const [c0, c1, c2] = PALETTES[(seed + 3) % PALETTES.length]
  const W = 1600
  const H = 900
  const jp = (japaneseTitle || '').replace(/[‐\-—\s]/g, '').slice(0, 7)
  const sunX = Math.round(W * (0.25 + r() * 0.5))
  const sunY = Math.round(H * (0.3 + r() * 0.2))

  const mountains = []
  for (let i = 0; i < 3; i++) {
    const y = H - 130 + i * 35
    const amp = 120 - i * 30
    const points = [`0,${H} 0,${y}`]
    const steps = 7
    for (let s = 1; s <= steps; s++) {
      const x = Math.round((W / steps) * s)
      const peak = y - Math.round(r() * amp)
      const valley = y + Math.round(r() * 40)
      points.push(`${x - Math.round(W / steps / 2)},${peak} ${x},${valley}`)
    }
    points.push(`${W},${H}`)
    mountains.push(
      `<polygon points="${points.join(' ')}" fill="#05050a" opacity="${0.45 + i * 0.22}"/>`,
    )
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="0.7" stop-color="${c0}"/>
        <stop offset="1" stop-color="#05050a"/>
      </linearGradient>
      <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stop-color="${c2}" stop-opacity="0.85"/>
        <stop offset="1" stop-color="${c2}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#05050a" stop-opacity="0"/>
        <stop offset="1" stop-color="#05050a" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <circle cx="${sunX}" cy="${sunY}" r="${Math.round(H * 0.5)}" fill="url(#sun)"/>
    <circle cx="${sunX}" cy="${sunY}" r="${Math.round(H * 0.16)}" fill="${c2}" opacity="0.35"/>
    ${streakItems(r, W, H, c2)}
    ${
      jp
        ? `<text x="${W - 70}" y="${H * 0.5}" text-anchor="end" font-family="'Yu Gothic', 'MS Gothic', sans-serif" font-size="120" fill="#ffffff" fill-opacity="0.1" letter-spacing="8">${jp}</text>`
        : ''
    }
    <rect width="${W}" height="${H}" fill="#05050a" opacity="0.25"/>
    ${mountains.join('')}
    <rect width="${W}" height="${H}" fill="url(#fade)"/>
  </svg>`

  const uri = toUri(svg)
  artCache.set(key, uri)
  return uri
}

export function avatarArt(name) {
  const key = `a:${name}`
  if (artCache.has(key)) return artCache.get(key)
  const seed = hashString(name)
  const r = mulberry32(seed)
  const [c0, c1, c2] = PALETTES[seed % PALETTES.length]
  const letter = (name || 'A').trim().charAt(0).toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="1" stop-color="${c0}"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" fill="url(#bg)"/>
    <circle cx="${Math.round(r() * 200)}" cy="${Math.round(r() * 200)}" r="80" fill="${c2}" opacity="0.25"/>
    <text x="100" y="132" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-size="88" font-weight="800" fill="#fff" fill-opacity="0.9">${letter}</text>
  </svg>`
  const uri = toUri(svg)
  artCache.set(key, uri)
  return uri
}
