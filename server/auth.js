import { Router } from 'express'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db, findUserById, findUserByUsername, publicUser } from './db.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SECRET_PATH = path.join(__dirname, '.secret')

if (!existsSync(SECRET_PATH)) {
  writeFileSync(SECRET_PATH, randomBytes(48).toString('hex'))
}
const JWT_SECRET = readFileSync(SECRET_PATH, 'utf8').trim()

const TOKEN_TTL_S = 7 * 24 * 3600
const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: TOKEN_TTL_S * 1000,
  path: '/',
}

export const authRouter = Router()

const attempts = new Map()
function tooManyAttempts(ip) {
  const now = Date.now()
  const windowMs = 10 * 60 * 1000
  const limit = 25
  const rec = attempts.get(ip)
  if (!rec || now > rec.until) {
    attempts.set(ip, { count: 1, until: now + windowMs })
    return false
  }
  rec.count += 1
  return rec.count > limit
}

function sign(user) {
  return jwt.sign({ uid: user.id, uname: user.username }, JWT_SECRET, {
    expiresIn: TOKEN_TTL_S,
  })
}

function currentUser(req) {
  const token = req.cookies?.akaru_token
  if (!token) return null
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    return findUserById(payload.uid) || null
  } catch {
    return null
  }
}

function requireAuth(req, res, next) {
  const user = currentUser(req)
  if (!user) return res.status(401).json({ error: 'Oturum bulunamadı. Giriş yap.' })
  req.user = user
  next()
}

const USERNAME_RE = /^[a-zA-Z0-9_.]{3,30}$/

authRouter.post('/register', (req, res) => {
  if (tooManyAttempts(req.ip)) {
    return res.status(429).json({ error: 'Çok fazla deneme. Birazdan tekrar dene.' })
  }
  const { username = '', displayName = '', password = '' } = req.body || {}

  if (!USERNAME_RE.test(username)) {
    return res.status(400).json({
      error: 'Kullanıcı adı 3-30 karakter olmalı; yalnızca harf, rakam, nokta ve alt çizgi.',
    })
  }
  if (typeof displayName === 'string' && displayName.trim().length > 40) {
    return res.status(400).json({ error: 'Görünen ad en fazla 40 karakter olabilir.' })
  }
  if (typeof password !== 'string' || password.length < 6 || password.length > 72) {
    return res.status(400).json({ error: 'Şifre en az 6 karakter olmalı.' })
  }

  if (findUserByUsername(username)) {
    return res.status(409).json({ error: 'Bu kullanıcı adı zaten alınmış.' })
  }

  const hash = bcrypt.hashSync(password, 10)
  const result = db
    .prepare('INSERT INTO users (username, display_name, password_hash, bio) VALUES (?, ?, ?, ?)')
    .run(username, (displayName || username).trim(), hash, '')

  const user = findUserById(result.lastInsertRowid)
  res.cookie('akaru_token', sign(user), COOKIE_OPTS)
  res.status(201).json({ user: publicUser(user) })
})

authRouter.post('/login', (req, res) => {
  if (tooManyAttempts(req.ip)) {
    return res.status(429).json({ error: 'Çok fazla deneme. Birazdan tekrar dene.' })
  }
  const { username = '', password = '' } = req.body || {}

  const user = findUserByUsername(String(username))
  if (!user || !bcrypt.compareSync(String(password), user.password_hash)) {
    return res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı.' })
  }

  res.cookie('akaru_token', sign(user), COOKIE_OPTS)
  res.json({ user: publicUser(user) })
})

authRouter.post('/logout', (req, res) => {
  res.clearCookie('akaru_token', { ...COOKIE_OPTS, maxAge: undefined })
  res.json({ ok: true })
})

authRouter.get('/me', (req, res) => {
  const user = currentUser(req)
  if (!user) return res.status(401).json({ error: 'Oturum bulunamadı.' })
  res.json({ user: publicUser(user) })
})

authRouter.patch('/profile', requireAuth, (req, res) => {
  const { displayName, bio } = req.body || {}
  const updates = {}

  if (typeof displayName === 'string') {
    const name = displayName.trim()
    if (!name || name.length > 40) {
      return res.status(400).json({ error: 'Görünen ad 1-40 karakter olmalı.' })
    }
    updates.display_name = name
  }
  if (typeof bio === 'string') {
    if (bio.length > 280) {
      return res.status(400).json({ error: 'Hakkında alanı en fazla 280 karakter olabilir.' })
    }
    updates.bio = bio
  }

  const keys = Object.keys(updates)
  if (keys.length === 0) {
    return res.status(400).json({ error: 'Güncellenecek alan yok.' })
  }
  const setSql = keys.map((k) => `${k} = ?`).join(', ')
  db.prepare(`UPDATE users SET ${setSql} WHERE id = ?`).run(
    ...keys.map((k) => updates[k]),
    req.user.id,
  )

  res.json({ user: publicUser(findUserById(req.user.id)) })
})
