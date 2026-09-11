import express from 'express'
import cookieParser from 'cookie-parser'
import path from 'node:path'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { authRouter } from './auth.js'
import { db } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(__dirname, '..', 'dist')
const PORT = process.env.PORT || 3001

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)

app.use(express.json({ limit: '32kb' }))
app.use(cookieParser())

app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: db.name ? 'connected' : 'connected' })
})

app.use('/api/auth', authRouter)

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Bilinmeyen API yolu.' })
})

if (existsSync(DIST)) {
  app.use(express.static(DIST))
  app.use((req, res) => {
    if (req.method === 'GET') {
      res.sendFile(path.join(DIST, 'index.html'))
    } else {
      res.status(405).end()
    }
  })
} else {
  app.use((req, res) => {
    res
      .status(503)
      .send('dist/ bulunamadı — önce "npm run build" çalıştırın. API /api/health adresinde çalışıyor.')
  })
}

app.listen(PORT, () => {
  console.log(`AKARU sunucusu http://localhost:${PORT} adresinde çalışıyor`)
})
