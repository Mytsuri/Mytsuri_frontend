  import { useEffect, useState } from 'react'
  import './Login.css'

  function Login() {
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search)
      const error = params.get('error')

      if (!error) return

      const errorMap = {
        google_auth_failed: '구글 로그인에 실패했습니다. 잠시 후 다시 시도해주세요.',
        unauthorized: '인증에 실패했습니다. 다시 로그인해주세요.',
      }

      setErrorMessage(errorMap[error] || '로그인 중 오류가 발생했습니다.')
    }, [])

    const handleGoogleLogin = () => {
      console.log('구글 로그인 버튼 클릭')
      setErrorMessage('')
      setIsLoading(true)

      try {
        // 팝업이 아니라 구글 OAuth 인증 화면으로 페이지 이동
        window.location.assign('http://localhost:5000/api/auth/google')
      } catch (error) {
        console.error('OAuth 이동 오류:', error)
        setErrorMessage('구글 인증 화면으로 이동하지 못했습니다.')
        setIsLoading(false)
      }
    }

    return (
      <div className="login-page">
        <div className="login-content">
          <div className="login-logo">
            <img src="/assets/logo_login.svg" alt="Mytsuri 로고" />
          </div>
          <div className="login-title">
            <img src="/assets/title.svg" alt="Mytsuri" />
          </div>
          <button
            type="button"
            className="google-login-btn"
            onClick={handleGoogleLogin}
            aria-label="구글 계정으로 로그인"
            aria-busy={isLoading}
            disabled={isLoading}
          >
            <GoogleIcon />
            <span>{isLoading ? '로그인 중...' : '구글 계정으로 로그인'}</span>
          </button>
          {errorMessage ? (
            <p className="login-error" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </div>
        <div className="login-safe-area" aria-hidden="true" />
      </div>
    )
  }

  function GoogleIcon() {
    return (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          fill="#EA4335"
        />
      </svg>
    )
  }

  export default Login