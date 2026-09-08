import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocalStorage } from '@/hooks/useLocalStorage'

const ListContext = createContext(null)

const EMPTY_LISTS = {
  watching: [],
  planned: [],
  completed: [],
  dropped: [],
  favorites: [],
}

export function ListProvider({ children }) {
  const [lists, setLists] = useLocalStorage('akaru:lists', EMPTY_LISTS)
  const [watched, setWatched] = useLocalStorage('akaru:watched', {})
  const [continueWatching, setContinueWatching] = useLocalStorage('akaru:continue', {})
  const [history, setHistory] = useLocalStorage('akaru:history', [])

  const statusOf = useCallback(
    (animeId) => {
      for (const [key, ids] of Object.entries(lists)) {
        if (key === 'favorites') continue
        if (ids.includes(animeId)) return key
      }
      return null
    },
    [lists],
  )

  const isFavorite = useCallback(
    (animeId) => lists.favorites.includes(animeId),
    [lists],
  )

  const setListStatus = useCallback(
    (animeId, status) => {
      setLists((prev) => {
        const next = { ...prev }
        for (const key of ['watching', 'planned', 'completed', 'dropped']) {
          next[key] = next[key].filter((id) => id !== animeId)
        }
        if (status && next[status]) {
          next[status] = [...next[status], animeId]
        }
        return next
      })
    },
    [setLists],
  )

  const toggleFavorite = useCallback(
    (animeId) => {
      setLists((prev) => ({
        ...prev,
        favorites: prev.favorites.includes(animeId)
          ? prev.favorites.filter((id) => id !== animeId)
          : [...prev.favorites, animeId],
      }))
      return !lists.favorites.includes(animeId)
    },
    [lists, setLists],
  )

  const removeFromList = useCallback(
    (animeId) => {
      setLists((prev) => {
        const next = { ...prev }
        for (const key of Object.keys(next)) {
          next[key] = next[key].filter((id) => id !== animeId)
        }
        return next
      })
    },
    [setLists],
  )

  const isEpisodeWatched = useCallback(
    (animeId, epNumber) => Boolean(watched[animeId]?.[epNumber]),
    [watched],
  )

  const markEpisodeWatched = useCallback(
    (animeId, epNumber) => {
      setWatched((prev) => ({
        ...prev,
        [animeId]: { ...(prev[animeId] || {}), [epNumber]: new Date().toISOString() },
      }))
    },
    [setWatched],
  )

  const toggleEpisodeWatched = useCallback(
    (animeId, epNumber) => {
      setWatched((prev) => {
        const forAnime = { ...(prev[animeId] || {}) }
        if (forAnime[epNumber]) {
          delete forAnime[epNumber]
        } else {
          forAnime[epNumber] = new Date().toISOString()
        }
        return { ...prev, [animeId]: forAnime }
      })
    },
    [setWatched],
  )

  const setProgress = useCallback(
    (animeId, epNumber, position, duration) => {
      setContinueWatching((prev) => ({
        ...prev,
        [animeId]: { ep: epNumber, position, duration, at: new Date().toISOString() },
      }))
    },
    [setContinueWatching],
  )

  const pushHistory = useCallback(
    (animeId, epNumber) => {
      setHistory((prev) =>
        [{ animeId, ep: epNumber, at: new Date().toISOString() }, ...prev.filter((h) => !(h.animeId === animeId && h.ep === epNumber))].slice(0, 12),
      )
    },
    [setHistory],
  )

  const getProgress = useCallback(
    (animeId) => continueWatching[animeId] || null,
    [continueWatching],
  )

  const getStats = useCallback(() => {
    const episodeCount = Object.values(watched).reduce((sum, eps) => sum + Object.keys(eps).length, 0)
    const totalMinutes = Object.entries(watched).reduce((sum, [animeId, eps]) => {
      return sum + Object.keys(eps).length * 24
    }, 0)
    return {
      completed: lists.completed.length,
      episodes: episodeCount,
      favorites: lists.favorites.length,
      watching: lists.watching.length,
      totalHours: Math.round(totalMinutes / 60),
    }
  }, [lists, watched])

  const value = useMemo(
    () => ({
      lists,
      statusOf,
      isFavorite,
      setListStatus,
      toggleFavorite,
      removeFromList,
      watched,
      isEpisodeWatched,
      markEpisodeWatched,
      toggleEpisodeWatched,
      continueWatching,
      getProgress,
      setProgress,
      pushHistory,
      history,
      getStats,
    }),
    [
      lists, statusOf, isFavorite, setListStatus, toggleFavorite, removeFromList,
      watched, isEpisodeWatched, markEpisodeWatched, toggleEpisodeWatched,
      continueWatching, getProgress, setProgress, pushHistory, history, getStats,
    ],
  )

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>
}

export function useList() {
  return useContext(ListContext)
}
