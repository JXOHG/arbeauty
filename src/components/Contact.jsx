"use client"

import { useState, useRef, useEffect } from "react"
import emailjs from "@emailjs/browser"
import { FaInstagram } from "react-icons/fa"
import { SiKakaotalk } from "react-icons/si"
import qr from "../images/qr.jpg"
import { useLanguage } from "../contexts/LanguageContext"

const isMobile = () => window.innerWidth <= 768

const Contact = () => {
  const form = useRef()
  const [status, setStatus] = useState("")
  const [statusType, setStatusType] = useState("") // 'success' | 'error'
  const [isOnMobile, setIsOnMobile] = useState(isMobile())
  const { t, language } = useLanguage()

  useEffect(() => {
    const handleResize = () => setIsOnMobile(isMobile())
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const sendEmail = (e) => {
    e.preventDefault()
    setStatus(t("contact.sending"))
    setStatusType("")

    const templateParams = {
      from_name: form.current.user_name.value,
      user_name: form.current.user_name.value,
      user_email: form.current.user_email.value,
      message: form.current.message.value,
      reply_to: form.current.user_email.value,
      to_name: "AR Beauty",
    }

    emailjs.send("service_kpim5a5", "template_10fxztq", templateParams, "9bd9kd2hoqTtulBVk").then(
      (result) => {
        setStatus(t("contact.success"))
        setStatusType("success")
        form.current.reset()
      },
      (error) => {
        setStatus(t("contact.error"))
        setStatusType("error")
      }
    )
  }

  return (
    <>
      <style>{`
        .contact-section {
          background: #111111;
          position: relative;
          overflow: hidden;
        }
        .contact-bg-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }
        .contact-inner {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 40px;
        }
        .contact-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .contact-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a96e;
          display: block;
          margin-bottom: 16px;
        }
        .contact-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          color: #fafaf8;
          line-height: 1.05;
        }
        .contact-title em { font-style: italic; color: #c9a96e; }
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
        }
        .contact-info-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a96e;
          display: block;
          margin-bottom: 32px;
        }
        .contact-info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 24px;
        }
        .contact-info-key {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(250,250,248,0.8);
        }
        .contact-info-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 400;
          color: #fafaf8;
        }
        .contact-info-value a {
          color: #fafaf8;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .contact-info-value a:hover { color: #c9a96e; }
        .contact-socials {
          display: flex;
          gap: 16px;
          margin-top: 32px;
          margin-bottom: 40px;
        }
        .contact-social-btn {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(201,169,110,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(250,250,248,0.7);
          text-decoration: none;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }
        .contact-social-btn:hover {
          border-color: #c9a96e;
          color: #c9a96e;
          background: rgba(201,169,110,0.08);
        }
        .contact-qr-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .contact-qr-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(250,250,248,0.8);
        }
        .contact-qr-img {
          width: 100px;
          height: 100px;
          border: 1px solid rgba(201,169,110,0.2);
          padding: 4px;
          background: #fafaf8;
        }
        /* Form */
        .contact-form-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a96e;
          display: block;
          margin-bottom: 32px;
        }
        .form-field {
          position: relative;
          margin-bottom: 36px;
        }
        .form-field-label {
          display: block;
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(250,250,248,0.8);
          margin-bottom: 10px;
          transition: color 0.3s ease;
        }
        .form-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(255,255,255,0.15);
          padding: 8px 0;
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 300;
          color: #fafaf8;
          outline: none;
          transition: border-color 0.3s ease;
        }
        .form-input:focus { border-bottom-color: #c9a96e; }
        .form-input::placeholder { color: rgba(250,250,248,0.2); }
        .form-textarea {
          resize: none;
          height: 100px;
        }
        .form-field:focus-within .form-field-label { color: #c9a96e; }
        .form-submit {
          width: 100%;
          padding: 18px;
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
        }
        .form-submit::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #c9a96e;
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .form-submit:hover { color: #0a0a0a; }
        .form-submit:hover::before { transform: translateX(0); }
        .form-submit span { position: relative; z-index: 1; }
        .form-status {
          margin-top: 20px;
          padding: 12px 16px;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-align: center;
          border-radius: 2px;
        }
        .form-status.success {
          background: rgba(201,169,110,0.1);
          border: 1px solid rgba(201,169,110,0.3);
          color: #c9a96e;
        }
        .form-status.error {
          background: rgba(200,60,60,0.1);
          border: 1px solid rgba(200,60,60,0.3);
          color: #e88080;
        }
        .form-status.pending {
          color: rgba(250,250,248,0.5);
        }
        @media (max-width: 768px) {
          .contact-inner { padding: 80px 20px; }
          .contact-grid { grid-template-columns: 1fr; gap: 60px; }
        }
      `}</style>

      <section id="contact" className="contact-section">
        <div className="contact-bg-pattern" />
        <div className="contact-inner">
          <div className="contact-header reveal">
            <span className="contact-eyebrow">{t("contact.getInTouch")}</span>
<h2 className="contact-title">
  {language === "en-US" ? (
    <>Contact <em>Us</em></>
  ) : (
    t("contact.title")
  )}
</h2>
          </div>

          <div className="contact-grid">
            {/* Left: contact info */}
            <div className="reveal-left">
              <span className="contact-info-label">{t("contact.reachUs")}</span>

              <div className="contact-info-item">
                <span className="contact-info-key">{t("contact.email")}</span>
                <span className="contact-info-value">
                  <a href="mailto:arbeauty2309@gmail.com">arbeauty2309@gmail.com</a>
                </span>
              </div>

              <div className="contact-info-item">
                <span className="contact-info-key">{t("contact.phone")}</span>
                <span className="contact-info-value">
                  {isOnMobile ? (
                    <a href="sms:+14373654320">(437) 365-4320</a>
                  ) : "(437) 365-4320"}
                </span>
              </div>

              <div className="contact-info-item">
                <span className="contact-info-key">KakaoTalk</span>
                <span className="contact-info-value">arbeauty2309</span>
              </div>

              <div className="contact-socials">
                <a href="https://www.instagram.com/arbeauty2309" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="http://qr.kakao.com/talk/4Rtne7MaI3qby8p5eprZNyvFJ5w-" target="_blank" rel="noopener noreferrer" className="contact-social-btn" aria-label="KakaoTalk">
                  <SiKakaotalk />
                </a>
              </div>

              <div className="contact-qr-wrap">
                <span className="contact-qr-label">KakaoTalk QR Code</span>
                <img src={qr || "/placeholder.svg"} alt="KakaoTalk QR Code" className="contact-qr-img" />
              </div>
            </div>

            {/* Right: form */}
            <div className="reveal-right">
              <span className="contact-form-label">{t("contact.sendMessage")}</span>
              <form ref={form} onSubmit={sendEmail}>
                <div className="form-field">
                  <label htmlFor="user_name" className="form-field-label">{t("contact.name")}</label>
                  <input type="text" name="user_name" id="user_name" required className="form-input" placeholder="Your name" />
                </div>
                <div className="form-field">
                  <label htmlFor="user_email" className="form-field-label">{t("contact.email")}</label>
                  <input type="email" name="user_email" id="user_email" required className="form-input" placeholder="your@email.com" />
                </div>
                <div className="form-field">
                  <label htmlFor="message" className="form-field-label">{t("contact.message")}</label>
                  <textarea name="message" id="message" required className="form-input form-textarea" placeholder="How can we help you?" />
                </div>
                <button type="submit" className="form-submit">
                  <span>{t("contact.send")}</span>
                </button>
              </form>
              {status && (
                <div className={`form-status ${statusType || "pending"}`}>
                  {status}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact
