import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

async function api(path, options = {}) {
  try {
    const res = await fetch(path, {
      credentials: 'include',
      headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
      ...options,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { ok: false, error: data.error || 'Bir hata oluştu. Tekrar dene.' }
    }
    return { ok: true, ...data }
  } catch {
    return { ok: false, error: 'Sunucuya ulaşılamıyor. Sunucunun çalıştığından emin ol.' }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)

  useEffect(() => {
    let alive = true
    api('/api/auth/me').then((res) => {
      if (!alive) return
      if (res.ok && res.user) setUser(res.user)
      setReady(true)
    })
    return () => {
      alive = false
    }
  }, [])

  const openLogin = useCallback(() => setLoginOpen(true), [])
  const closeLogin = useCallback(() => setLoginOpen(false), [])

  const register = useCallback(async (username, displayName, password) => {
    const res = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, displayName, password }),
    })
    if (res.ok) setUser(res.user)
    return res
  }, [])

  const login = useCallback(async (username, password) => {
    const res = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
    if (res.ok) setUser(res.user)
    return res
  }, [])

  const logout = useCallback(async () => {
    const res = await api('/api/auth/logout', { method: 'POST' })
    if (res.ok) setUser(null)
    return res
  }, [])

  const updateUser = useCallback(async (patch) => {
    const res = await api('/api/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(patch),
    })
    if (res.ok) setUser(res.user)
    return res
  }, [])

  const value = useMemo(
    () => ({
      user,
      ready,
      login,
      register,
      logout,
      updateUser,
      loginOpen,
      openLogin,
      closeLogin,
    }),
    [user, ready, login, register, logout, updateUser, loginOpen, openLogin, closeLogin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
