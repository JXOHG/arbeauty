"use client"

import { useState } from "react"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { language, t } = useLanguage()
  const isKorean = language === "ko-KR"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      if (response.ok) {
        const { accessToken } = await response.json()
        localStorage.setItem("token", accessToken)
        onLogin()
      } else {
        setError(isKorean ? t("admin.invalidCredentials") : "Invalid username or password")
      }
    } catch (err) {
      setError(isKorean ? t("admin.loginError") : "An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        .login-page {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          position: relative;
          overflow: hidden;
        }
        .login-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
        }
        .login-box {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 400px;
          border: 1px solid rgba(201,169,110,0.15);
          padding: 60px 48px;
          background: rgba(17,17,17,0.9);
        }
        .login-ornament {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
          justify-content: center;
        }
        .login-line { height: 1px; width: 40px; background: rgba(201,169,110,0.3); }
        .login-diamond {
          width: 5px; height: 5px;
          background: #c9a96e;
          transform: rotate(45deg);
        }
        .login-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 300;
          color: #fafaf8;
          text-align: center;
          margin-bottom: 8px;
          letter-spacing: 0.05em;
        }
        .login-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.6);
          text-align: center;
          margin-bottom: 48px;
        }
        .login-field {
          margin-bottom: 32px;
          position: relative;
        }
        .login-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 0.62rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(250,250,248,0.4);
          margin-bottom: 10px;
          transition: color 0.3s ease;
        }
        .login-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.12);
          padding: 10px 0;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #fafaf8;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .login-input:focus { border-bottom-color: #c9a96e; }
        .login-input::placeholder { color: rgba(250,250,248,0.2); }
        .login-field:focus-within .login-label { color: #c9a96e; }
        .login-error {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          color: #e88080;
          text-align: center;
          margin-bottom: 20px;
          padding: 10px;
          background: rgba(200,60,60,0.08);
          border: 1px solid rgba(200,60,60,0.2);
        }
        .login-btn {
          width: 100%;
          padding: 16px;
          background: transparent;
          border: 1px solid #c9a96e;
          color: #c9a96e;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
          margin-top: 8px;
        }
        .login-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #c9a96e;
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .login-btn:hover:not(:disabled) { color: #0a0a0a; }
        .login-btn:hover:not(:disabled)::before { transform: translateX(0); }
        .login-btn span { position: relative; z-index: 1; }
        .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div className="login-page">
        <div className="login-bg" />
        <div className="login-box">
          <div className="login-ornament">
            <div className="login-line" />
            <div className="login-diamond" />
            <div className="login-line" />
          </div>
          <h2 className="login-title">
            {isKorean ? t("admin.loginTitle") : "Admin Login"}
          </h2>
          <p className="login-subtitle">AR Beauty Management</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="username" className="login-label">
                {isKorean ? t("admin.username") : "Username"}
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="login-input"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="login-field">
              <label htmlFor="password" className="login-label">
                {isKorean ? t("admin.password") : "Password"}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" disabled={isLoading} className="login-btn">
              <span>{isLoading ? "Signing in…" : (isKorean ? t("admin.signIn") : "Sign in")}</span>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login