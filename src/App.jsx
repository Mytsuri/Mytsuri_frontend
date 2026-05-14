import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import MapPage from './pages/Map'
import List from './pages/List'
import Profile from './pages/Profile'
import FestivalList from './pages/FestivalList'
import Notification from './pages/Notification'
import Search from './pages/Search'
import FestivalDetail from './pages/FestivalDetail'
import ListDetail from './pages/ListDetail'
import ListAddFestival from './pages/ListAddFestival'
import ListInvite from './pages/ListInvite'
import ListEdit from './pages/ListEdit'
import ListEditFestivals from './pages/ListEditFestivals'
import ProfileEdit from './pages/ProfileEdit'
import Onboarding from './pages/Onboarding'
import OnboardingSurvey from './pages/OnboardingSurvey'
import ReviewWrite from './pages/ReviewWrite'

function App() {
  const ONBOARDING_DONE_KEY = 'mytsuri_onboarding_done'
  const [authStatus, setAuthStatus] = useState('loading')
  const [needsOnboarding, setNeedsOnboarding] = useState(false)

  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()
    const refreshToken = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal,
        })
        return res.ok
      } catch {
        return false
      }
    }

    const checkAuth = async () => {
      try {
        let res = await fetch('http://localhost:5000/api/users/me', {
          method: 'GET',
          credentials: 'include',
          signal: controller.signal,
        })

        if (res.status === 401) {
          const refreshed = await refreshToken()
          if (refreshed) {
            res = await fetch('http://localhost:5000/api/users/me', {
              method: 'GET',
              credentials: 'include',
              signal: controller.signal,
            })
          }
        }

        if (!isMounted) return
        if (!res.ok) {
          setAuthStatus('guest')
          setNeedsOnboarding(false)
          return
        }

        const userData = await res.json().catch(() => ({}))
        const onboardingCompleted =
          Boolean(userData?.onboardingCompleted) ||
          localStorage.getItem(ONBOARDING_DONE_KEY) === 'true'
        if (onboardingCompleted) {
          localStorage.setItem(ONBOARDING_DONE_KEY, 'true')
        }
        setNeedsOnboarding(!onboardingCompleted)
        setAuthStatus('authed')
      } catch (error) {
        if (error.name === 'AbortError') return
        if (isMounted) {
          setAuthStatus('guest')
          setNeedsOnboarding(false)
        }
      }
    }

    checkAuth()

    // 로그아웃 이벤트 리스너
    const handleLogout = () => {
      if (isMounted) {
        setAuthStatus('guest')
        setNeedsOnboarding(false)
      }
    }
    const handleOnboardingCompleted = () => {
      if (isMounted) {
        localStorage.setItem(ONBOARDING_DONE_KEY, 'true')
        setNeedsOnboarding(false)
      }
    }
    window.addEventListener('logout', handleLogout)
    window.addEventListener('onboardingCompleted', handleOnboardingCompleted)

    return () => {
      isMounted = false
      controller.abort()
      window.removeEventListener('logout', handleLogout)
      window.removeEventListener('onboardingCompleted', handleOnboardingCompleted)
    }
  }, [])

  if (authStatus === 'loading') return null

  const isLoggedIn = authStatus === 'authed'
  const getProtectedElement = (element) => {
    if (!isLoggedIn) return <Navigate to="/login" replace />
    if (needsOnboarding) return <Navigate to="/onboarding" replace />
    return element
  }

  return (
    <Routes>
      {/* 인증/온보딩 분기 */}
      <Route path="/login" element={isLoggedIn ? <Navigate to={needsOnboarding ? '/onboarding' : '/'} replace /> : <Login />} />
      <Route path="/onboarding" element={isLoggedIn ? (needsOnboarding ? <Onboarding /> : <Navigate to="/" replace />) : <Navigate to="/login" replace />} />
      <Route path="/onboarding/survey" element={isLoggedIn ? (needsOnboarding ? <OnboardingSurvey /> : <Navigate to="/" replace />) : <Navigate to="/login" replace />} />

      {/* 인증 필요 */}
      <Route path="/" element={getProtectedElement(<Home />)} />
      <Route path="/map" element={getProtectedElement(<MapPage />)} />
      <Route path="/search" element={getProtectedElement(<Search />)} />
      <Route path="/notifications" element={getProtectedElement(<Notification />)} />

      <Route path="/list" element={getProtectedElement(<List />)} />
      <Route path="/list/new" element={getProtectedElement(<ListDetail />)} />
      <Route path="/list/:id" element={getProtectedElement(<ListDetail />)} />
      <Route path="/list/:id/add" element={getProtectedElement(<ListAddFestival />)} />
      <Route path="/list/:id/invite" element={getProtectedElement(<ListInvite />)} />
      <Route path="/list/:id/edit" element={getProtectedElement(<ListEdit />)} />
      <Route path="/list/:id/edit-festivals" element={getProtectedElement(<ListEditFestivals />)} />

      <Route path="/profile" element={getProtectedElement(<Profile />)} />
      <Route path="/profile/edit" element={getProtectedElement(<ProfileEdit />)} />

      <Route path="/festivals" element={getProtectedElement(<FestivalList />)} />
      <Route path="/festivals/city/:cityId" element={getProtectedElement(<FestivalList />)} />
      <Route path="/festivals/:category" element={getProtectedElement(<FestivalList />)} />

      <Route path="/festival/:id" element={getProtectedElement(<FestivalDetail />)} />
      <Route path="/festival/:id/review" element={getProtectedElement(<ReviewWrite />)} />

      {/* 404 - 와일드카드는 반드시 마지막 */}
      <Route path="*" element={<Navigate to={isLoggedIn ? '/' : '/login'} replace />} />
    </Routes>
  )
}

export default App
