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
        <h1 className="viewport-gate-title">모바일 화면에서 이용해 주세요</h1>
        <p className="viewport-gate-desc">
          Mytsuri는 스마트폰에 맞춰 만들어졌어요.
          <br />
          PC에서는 브라우저 창을 <strong>767px 이하</strong>로 줄이면 바로 사용할 수 있어요.
        </p>
        <p className="viewport-gate-hint">개발자 도구(F12) → 반응형 모드로 확인할 수도 있어요.</p>
      </div>
    </div>
  )
}

export default MobileViewportGate
