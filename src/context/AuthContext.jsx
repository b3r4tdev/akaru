import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { DEFAULT_USER } from '@/data/userData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('akaru:user', null)
  const [loginOpen, setLoginOpen] = useState(false)

  const openLogin = useCallback(() => setLoginOpen(true), [])
  const closeLogin = useCallback(() => setLoginOpen(false), [])

  const login = useCallback(
    (username, displayName) => {
      const clean = username.trim().replace(/\s+/g, '')
      if (!clean) return false
      setUser({
        username: clean,
        displayName: (displayName || clean).trim() || clean,
        joinedAt: new Date().toISOString(),
        bio: DEFAULT_USER.bio,
      })
      return true
    },
    [setUser],
  )

  const logout = useCallback(() => {
    setUser(null)
  }, [setUser])

  const updateUser = useCallback(
    (patch) => {
      setUser((u) => (u ? { ...u, ...patch } : u))
    },
    [setUser],
  )

  const value = useMemo(
    () => ({ user, login, logout, updateUser, loginOpen, openLogin, closeLogin }),
    [user, login, logout, updateUser, loginOpen, openLogin, closeLogin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
