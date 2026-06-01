import { useEffect, useState } from 'react'

/**
 * 실제 휴대폰만 (세 조건 모두 충족)
 * - 좁은 화면 + 터치(primary) + hover 없음
 * PC 창 축소·태블릿·데스크톱은 제외
 */
export const MOBILE_PHONE_MEDIA =
  '(max-width: 767px) and (hover: none) and (pointer: coarse)'

export function useIsMobilePhone() {
  const [isMobilePhone, setIsMobilePhone] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(MOBILE_PHONE_MEDIA).matches
  })

  useEffect(() => {
    const media = window.matchMedia(MOBILE_PHONE_MEDIA)
    const update = () => setIsMobilePhone(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return isMobilePhone
}
