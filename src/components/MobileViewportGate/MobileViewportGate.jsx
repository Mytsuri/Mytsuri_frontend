import { useMobileViewport } from '../../hooks/useMobileViewport'
import './MobileViewportGate.css'

function MobileViewportGate({ children }) {
  const isMobileViewport = useMobileViewport()

  if (isMobileViewport) {
    return children
  }

  return (
    <div className="viewport-gate">
      <div className="viewport-gate-card">
        <img
          className="viewport-gate-logo"
          src="/assets/title.svg"
          alt="Mytsuri"
        />
        <h1 className="viewport-gate-title">스마트폰에서 이용해 주세요</h1>
        <p className="viewport-gate-desc">
          Mytsuri는 스마트폰에 맞춰 만들어졌어요.
          <br />
          휴대폰 브라우저로 접속하거나 <strong>홈 화면에 추가</strong>해 앱처럼 사용할 수 있어요.
        </p>
        <p className="viewport-gate-hint">PC에서는 브라우저 창을 767px 이하로 줄이면 미리볼 수 있어요.</p>
      </div>
    </div>
  )
}

export default MobileViewportGate
