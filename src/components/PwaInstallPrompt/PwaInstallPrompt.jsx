import { useEffect, useState } from 'react'
import { isStandalonePwa } from '../../hooks/useMobileViewport'
import './PwaInstallPrompt.css'

const DISMISS_KEY = 'mytsuri_pwa_install_dismissed'

function isIos() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isAndroid() {
  if (typeof navigator === 'undefined') return false
  return /android/i.test(navigator.userAgent)
}

function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    if (isStandalonePwa() || localStorage.getItem(DISMISS_KEY) === 'true') {
      return undefined
    }

    const isMobile = isIos() || isAndroid()
    if (!isMobile) return undefined

    if (isIos()) {
      setIosHint(true)
      setVisible(true)
      return undefined
    }

    const handleBeforeInstall = (event) => {
      event.preventDefault()
      setDeferredPrompt(event)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, 'true')
    setVisible(false)
  }

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="pwa-install" role="dialog" aria-label="앱 설치 안내">
      <div className="pwa-install-card">
        <p className="pwa-install-title">Mytsuri를 앱처럼 사용해 보세요</p>
        {iosHint ? (
          <p className="pwa-install-desc">
            Safari 하단 <strong>공유</strong> 버튼 → <strong>홈 화면에 추가</strong>를 눌러주세요.
          </p>
        ) : (
          <p className="pwa-install-desc">홈 화면에 추가하면 앱처럼 빠르게 열 수 있어요.</p>
        )}
        <div className="pwa-install-actions">
          {!iosHint && deferredPrompt ? (
            <button type="button" className="pwa-install-btn pwa-install-btn--primary" onClick={handleInstall}>
              설치하기
            </button>
          ) : null}
          <button type="button" className="pwa-install-btn" onClick={handleDismiss}>
            나중에
          </button>
        </div>
      </div>
    </div>
  )
}

export default PwaInstallPrompt
