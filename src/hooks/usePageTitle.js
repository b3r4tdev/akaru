import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — AKARU` : 'AKARU — Anime İzleme Platformu'
    return () => {
      document.title = 'AKARU — Anime İzleme Platformu'
    }
  }, [title])
}
