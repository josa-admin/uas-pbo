import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a2318;
          font-family: 'Inter', sans-serif;
          overflow: auto;
        }

        .login-card {
          position: relative;
          width: 100%;
          max-width: 440px;
          padding: 28px 24px;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.75s cubic-bezier(0.4,0,0.2,1),
                      transform 0.75s cubic-bezier(0.4,0,0.2,1);
        }

        .login-card.mounted {
          opacity: 1;
          transform: translateY(0);
        }

        .login-logo-area {
          text-align: center;
          margin-bottom: 28px;
        }

        .login-wms {
          font-size: 46px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 5px;
          line-height: 1;
          margin-bottom: 6px;
        }

        .login-brand {
          font-size: 13px;
          letter-spacing: 0.2px;
        }

        .login-brand .light { color: #3ecf8e; font-weight: 400; }
        .login-brand .bold  { color: #3ecf8e; font-weight: 700; }

        .login-welcome {
          text-align: center;
          margin-bottom: 28px;
        }

        .login-welcome h2 {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
          letter-spacing: 0.2px;
        }

        .login-welcome p {
          font-size: 13px;
          color: rgba(255,255,255,0.42);
          line-height: 1.75;
        }

        .input-wrap {
          position: relative;
          margin-bottom: 12px;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(255,255,255,0.3);
          display: flex;
          align-items: center;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          padding: 14px 14px 14px 44px;
          font-size: 14px;
          color: rgba(255,255,255,0.88);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          font-family: 'Inter', sans-serif;
        }

        .login-input:focus {
          border-color: rgba(62,207,142,0.55);
          box-shadow: 0 0 0 3px rgba(62,207,142,0.1);
        }

        .login-input::placeholder {
          color: rgba(255,255,255,0.28);
        }

        .login-input.has-eye {
          padding-right: 46px;
        }

        .eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.38);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .eye-btn:hover { color: rgba(255,255,255,0.7); }

        .login-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 22px;
          margin-top: 2px;
        }

        .remember-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          user-select: none;
        }

        .remember-label input[type=checkbox] {
          width: 15px;
          height: 15px;
          accent-color: #3ecf8e;
          cursor: pointer;
        }

        .forgot-btn {
          background: none;
          border: none;
          color: #3ecf8e;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: opacity 0.2s;
        }

        .forgot-btn:hover { opacity: 0.72; }

        .submit-btn {
          width: 100%;
          padding: 14px;
          font-size: 15px;
          font-weight: 600;
          color: #ffffff;
          background: #3ecf8e;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          letter-spacing: 0.3px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 20px;
          transition: background 0.2s, transform 0.15s;
        }

        .submit-btn:hover:not(:disabled) {
          background: #2fb87a;
          transform: translateY(-1px);
        }

        .submit-btn:disabled {
          background: rgba(62,207,142,0.65);
          cursor: not-allowed;
        }

        .or-sep {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .or-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }

        .or-text {
          font-size: 11px;
          color: rgba(255,255,255,0.32);
          letter-spacing: 1.5px;
          font-weight: 600;
        }

        .google-btn {
          width: 100%;
          padding: 13px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.85);
          background: transparent;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: border-color 0.2s, background 0.2s, transform 0.15s;
        }

        .google-btn:hover {
          border-color: rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.05);
          transform: translateY(-1px);
        }

        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }

        .spinner {
          width: 17px;
          height: 17px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spinLoader 0.6s linear infinite;
        }
      `}</style>

      <div className="login-root">
        <div className={`login-card${mounted ? ' mounted' : ''}`}>

          {/* ── Logo & Brand ── */}
          <div className="login-logo-area">
            <div style={{ marginBottom: '12px', display: 'inline-block' }}>
              <svg
                width="56"
                height="56"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <polygon
                  points="60,12 100,34 60,56 20,34"
                  stroke="#3ecf8e"
                  strokeWidth="2.2"
                  fill="rgba(62,207,142,0.06)"
                  strokeLinejoin="round"
                />
                <line x1="60" y1="12" x2="60" y2="56" stroke="#3ecf8e" strokeWidth="1.7" strokeLinecap="round"/>
                <line x1="20" y1="34" x2="100" y2="34" stroke="#3ecf8e" strokeWidth="1.7" strokeLinecap="round"/>
                <polygon
                  points="20,34 60,56 60,100 20,78"
                  stroke="#3ecf8e"
                  strokeWidth="2.2"
                  fill="rgba(62,207,142,0.03)"
                  strokeLinejoin="round"
                />
                <polygon
                  points="100,34 100,78 60,100 60,56"
                  stroke="#3ecf8e"
                  strokeWidth="2.2"
                  fill="rgba(62,207,142,0.03)"
                  strokeLinejoin="round"
                />
                <line x1="20" y1="34" x2="20" y2="114" stroke="#3ecf8e" strokeWidth="1.1" strokeOpacity="0.5" strokeLinecap="round"/>
                <line x1="23" y1="98" x2="64" y2="82" stroke="#3ecf8e" strokeWidth="1.1" strokeOpacity="0.38" strokeLinecap="round"/>
              </svg>
            </div>

            <div className="login-wms">WMS</div>
            <div className="login-brand">
              <span className="light">Warehouse </span>
              <span className="bold">Management System</span>
            </div>
          </div>

          {/* ── Welcome ── */}
          <div className="login-welcome">
            <h2>Selamat Datang!</h2>
            <p>
              Silakan login untuk mengakses sistem
              <br />
              manajemen gudang Anda.
            </p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit}>

            {/* Username / Email */}
            <div className="input-wrap">
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                id="login-email"
                className="login-input"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username atau Email"
                required
              />
            </div>

            {/* Password */}
            <div className="input-wrap" style={{ marginBottom: '14px' }}>
              <span className="input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="login-password"
                className="login-input has-eye"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="button"
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Remember + Forgot */}
            <div className="login-row">
              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Ingat saya
              </label>
              <button type="button" className="forgot-btn">
                Lupa password?
              </button>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Sistem
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>

            {/* OR */}
            <div className="or-sep">
              <div className="or-line" />
              <span className="or-text">ATAU</span>
              <div className="or-line" />
            </div>

            {/* Google */}
            <button type="button" className="google-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Login dengan Google
            </button>

          </form>
        </div>
      </div>
    </>
  );
}
