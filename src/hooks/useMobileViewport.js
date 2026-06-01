import { useEffect, useState } from 'react'

/** 앱 사용 가능 너비: 실제 폰 + PC에서 창 축소 */
export const APP_VIEWPORT_MEDIA = '(max-width: 767px)'

export function useMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia(APP_VIEWPORT_MEDIA).matches
  })

  useEffect(() => {
    const media = window.matchMedia(APP_VIEWPORT_MEDIA)
    const update = () => setIsMobileViewport(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return isMobileViewport
}
