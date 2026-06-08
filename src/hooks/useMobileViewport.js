import { useEffect, useState } from 'react'

/** 앱 사용 가능 너비: 실제 폰 + PC에서 창 축소 */
export const APP_VIEWPORT_MEDIA = '(max-width: 767px)'

export function isStandalonePwa() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.navigator.standalone === true
  )
}

export function isMobileViewportWidth() {
  if (typeof window === 'undefined') return true
  return window.matchMedia(APP_VIEWPORT_MEDIA).matches
}

export function canUseAppViewport() {
  return isStandalonePwa() || isMobileViewportWidth()
}

export function useMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(() => canUseAppViewport())

  useEffect(() => {
    const media = window.matchMedia(APP_VIEWPORT_MEDIA)
    const standaloneMedia = window.matchMedia('(display-mode: standalone)')
    const fullscreenMedia = window.matchMedia('(display-mode: fullscreen)')

    const update = () => setIsMobileViewport(canUseAppViewport())

    update()
    media.addEventListener('change', update)
    standaloneMedia.addEventListener('change', update)
    fullscreenMedia.addEventListener('change', update)
    window.addEventListener('appinstalled', update)

    return () => {
      media.removeEventListener('change', update)
      standaloneMedia.removeEventListener('change', update)
      fullscreenMedia.removeEventListener('change', update)
      window.removeEventListener('appinstalled', update)
    }
  }, [])

  return isMobileViewport
}
