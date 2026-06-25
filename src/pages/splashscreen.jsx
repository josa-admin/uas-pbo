import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SplashScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('enter');

  useEffect(() => {
    // Mulai fade out setelah 3 detik
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 3000);

    // Navigasi ke login setelah fade selesai
    const navTimer = setTimeout(() => {
      navigate('/login');
    }, 3900);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  const isExit = phase === 'exit';

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .splash-root {
          position: fixed;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #0a2318;
          z-index: 9999;
          font-family: 'Inter', sans-serif;
          pointer-events: auto;
          transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .splash-root.exit {
          opacity: 0;
          pointer-events: none;
        }

        .splash-icon {
          margin-bottom: 28px;
          animation: iconFloat 3s ease-in-out infinite;
          opacity: 0;
          animation: iconFloat 3s ease-in-out 0.3s infinite, fadeUp 0.8s ease-out 0.1s forwards;
        }

        .splash-title {
          font-size: 80px;
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 8px;
          line-height: 1;
          opacity: 0;
          animation: fadeUp 0.8s ease-out 0.5s forwards;
          margin-bottom: 10px;
        }

        .splash-subtitle {
          font-size: 28px;
          font-weight: 400;
          letter-spacing: 0.5px;
          opacity: 0;
          animation: fadeUp 0.8s ease-out 0.75s forwards;
          margin-bottom: 30px;
          display: flex;
          gap: 10px;
        }

        .splash-subtitle .light {
          color: #3ecf8e;
          font-weight: 400;
        }

        .splash-subtitle .bold {
          color: #3ecf8e;
          font-weight: 700;
        }

        .splash-desc {
          font-size: 15px;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          line-height: 1.8;
          opacity: 0;
          animation: fadeUp 0.8s ease-out 1s forwards;
        }

        .splash-dots {
          display: flex;
          gap: 10px;
          margin-top: 50px;
          opacity: 0;
          animation: fadeUp 0.8s ease-out 1.3s forwards;
        }

        .splash-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3ecf8e;
        }

        .splash-dot:nth-child(1) { animation: dotPulse 1.4s ease-in-out 0s infinite; }
        .splash-dot:nth-child(2) { animation: dotPulse 1.4s ease-in-out 0.22s infinite; }
        .splash-dot:nth-child(3) { animation: dotPulse 1.4s ease-in-out 0.44s infinite; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes iconFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-12px); }
        }

        @keyframes dotPulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.75); }
          40%            { opacity: 1;    transform: scale(1.3); }
        }

        @keyframes drawLine {
          from { stroke-dashoffset: 600; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      <div className={`splash-root${isExit ? ' exit' : ''}`}>

        {/* ── Logo Kotak Besar ── */}
        <div className="splash-icon">
          <svg
            width="220"
            height="220"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top face (diamond) */}
            <polygon
              points="60,12 100,34 60,56 20,34"
              stroke="#3ecf8e"
              strokeWidth="1.8"
              fill="rgba(62,207,142,0.04)"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: 'drawLine 1.6s ease-out 0.2s forwards',
              }}
            />
            {/* Vertical cross line */}
            <line
              x1="60" y1="12" x2="60" y2="56"
              stroke="#3ecf8e" strokeWidth="1.4" strokeLinecap="round"
              style={{
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: 'drawLine 1.4s ease-out 0.5s forwards',
              }}
            />
            {/* Horizontal cross line */}
            <line
              x1="20" y1="34" x2="100" y2="34"
              stroke="#3ecf8e" strokeWidth="1.4" strokeLinecap="round"
              style={{
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: 'drawLine 1.4s ease-out 0.5s forwards',
              }}
            />
            {/* Left face */}
            <polygon
              points="20,34 60,56 60,100 20,78"
              stroke="#3ecf8e"
              strokeWidth="1.8"
              fill="rgba(62,207,142,0.025)"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: 'drawLine 1.6s ease-out 0.65s forwards',
              }}
            />
            {/* Right face */}
            <polygon
              points="100,34 100,78 60,100 60,56"
              stroke="#3ecf8e"
              strokeWidth="1.8"
              fill="rgba(62,207,142,0.025)"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: 'drawLine 1.6s ease-out 0.8s forwards',
              }}
            />
            {/* Vertical accent below bottom-left corner */}
            <line
              x1="20" y1="34" x2="20" y2="114"
              stroke="#3ecf8e" strokeWidth="1.1" strokeOpacity="0.45" strokeLinecap="round"
              style={{
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: 'drawLine 1.4s ease-out 1.0s forwards',
              }}
            />
            {/* Diagonal accent inside box */}
            <line
              x1="23" y1="98" x2="64" y2="82"
              stroke="#3ecf8e" strokeWidth="1.1" strokeOpacity="0.35" strokeLinecap="round"
              style={{
                strokeDasharray: 600,
                strokeDashoffset: 600,
                animation: 'drawLine 1.2s ease-out 1.1s forwards',
              }}
            />
          </svg>
        </div>

        {/* ── WMS ── */}
        <h1 className="splash-title">WMS</h1>

        {/* ── Warehouse Management System ── */}
        <div className="splash-subtitle">
          <span className="light">Warehouse</span>
          <span className="bold">Management System</span>
        </div>

        {/* ── Deskripsi ── */}
        <p className="splash-desc">
          Kelola Inventori, Pantau Stok, dan Tingkatkan
          <br />
          Efisiensi Gudang Secara Real-Time
        </p>

        {/* ── Loading dots ── */}
        <div className="splash-dots">
          <div className="splash-dot" />
          <div className="splash-dot" />
          <div className="splash-dot" />
        </div>

      </div>
    </>
  );
}
