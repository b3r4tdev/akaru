import { Suspense, lazy, useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ToastProvider } from '@/context/ToastContext'
import { AuthProvider } from '@/context/AuthContext'
import { ListProvider } from '@/context/ListContext'
import { Navbar } from '@/components/Navbar/Navbar'
import { Footer } from '@/components/Footer/Footer'
import { LoginModal } from '@/components/Auth/LoginModal'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import { PageFallback } from '@/components/ui/PageShell'

const HomePage = lazy(() => import('@/pages/Home/HomePage'))
const AnimeListPage = lazy(() => import('@/pages/Anime/AnimeListPage'))
const AnimeDetailPage = lazy(() => import('@/pages/AnimeDetail/AnimeDetailPage'))
const WatchPage = lazy(() => import('@/pages/Watch/WatchPage'))
const GenresPage = lazy(() => import('@/pages/Genres/GenresPage'))
const CalendarPage = lazy(() => import('@/pages/Calendar/CalendarPage'))
const ProfilePage = lazy(() => import('@/pages/Profile/ProfilePage'))
const MyListPage = lazy(() => import('@/pages/MyList/MyListPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'))

function AnimatedRoutes() {
  const location = useLocation()
  const isWatch = location.pathname.startsWith('/izle')

  return (
    <>
      <Suspense fallback={<PageFallback />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/animeler" element={<AnimeListPage />} />
            <Route path="/anime/:id" element={<AnimeDetailPage />} />
            <Route path="/izle/:animeId/:ep" element={<WatchPage />} />
            <Route path="/turler" element={<GenresPage />} />
            <Route path="/takvim" element={<CalendarPage />} />
            <Route path="/profil" element={<ProfilePage />} />
            <Route path="/listem" element={<MyListPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      {!isWatch && <Footer />}
    </>
  )
}

export default function App() {
  const [booting, setBooting] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setBooting(false), 1300)
    return () => clearTimeout(t)
  }, [])

  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ListProvider>
            <AnimatePresence>{booting && <LoadingScreen key="boot" />}</AnimatePresence>
            <div className="flex min-h-screen flex-col bg-night">
              <Navbar />
              <div className="flex-1">
                <AnimatedRoutes />
              </div>
            </div>
            <ScrollToTop />
            <LoginModal />
          </ListProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
