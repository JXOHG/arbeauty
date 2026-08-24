"use client"

import { useEffect, useRef, useState } from "react"
import { Link as ScrollLink } from "react-scroll"
import { useLanguage } from "../contexts/LanguageContext"

const Hero = () => {
  const { t } = useLanguage()
  const parallaxRef = useRef(null)
  const heroContentRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrollY(y)
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${y * 0.45}px)`
      }
      if (heroContentRef.current) {
        heroContentRef.current.style.transform = `translateY(${y * 0.2}px)`
        heroContentRef.current.style.opacity = `${1 - y / 700}`
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <style>{`
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0a0a0a;
        }
        .hero-bg-wrap {
          position: absolute;
          inset: -20%;
          will-change: transform;
        }
        .hero-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
        }
        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            160deg,
            rgba(10,10,10,0.75) 0%,
            rgba(10,10,10,0.45) 50%,
            rgba(10,10,10,0.8) 100%
          );
          z-index: 1;
        }
        .hero-overlay-bottom {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to top, #0a0a0a, transparent);
          z-index: 2;
        }
        .hero-content {
          position: relative;
          z-index: 3;
          text-align: center;
          padding: 20px;
          will-change: transform, opacity;
        }
        .hero-eyebrow {
          display: inline-block;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 24px;
          opacity: 0;
          animation: fadeUp 1s 0.3s ease forwards;
        }
        .hero-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(4rem, 10vw, 9rem);
          font-weight: 300;
          color: #fafaf8;
          line-height: 0.95;
          letter-spacing: -0.01em;
          margin-bottom: 32px;
          opacity: 0;
          animation: fadeUp 1.1s 0.55s ease forwards;
        }
        .hero-title em {
          font-style: italic;
          font-weight: 300;
          color: #e8c98a;
        }
        .hero-tagline {
          font-family: 'Jost', sans-serif;
          font-size: clamp(0.85rem, 2vw, 1rem);
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(250,250,248,0.7);
          margin-bottom: 48px;
          opacity: 0;
          animation: fadeUp 1.1s 0.8s ease forwards;
        }
        .hero-cta-wrap {
          display: flex;
          gap: 20px;
          justify-content: center;
          flex-wrap: wrap;
          opacity: 0;
          animation: fadeUp 1.1s 1s ease forwards;
        }
        .hero-cta-primary {
          display: inline-block;
          padding: 16px 48px;
          background: transparent;
          border: 1px solid #c9a96e;
          color: #c9a96e;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.4s ease;
          position: relative;
          overflow: hidden;
        }
        .hero-cta-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #c9a96e;
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .hero-cta-primary:hover { color: #0a0a0a; }
        .hero-cta-primary:hover::before { transform: translateX(0); }
        .hero-cta-span { position: relative; z-index: 1; }
        .hero-scroll-indicator {
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: fadeIn 1s 1.5s ease forwards;
        }
        .scroll-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.6rem;
          font-weight: 400;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(201,169,110,0.7);
        }
        .scroll-line {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, rgba(201,169,110,0.7), transparent);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.7; transform: scaleY(1); transform-origin: top; }
          50% { opacity: 1; }
        }
        .hero-gold-bar {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, transparent, rgba(201,169,110,0.5));
          z-index: 3;
          opacity: 0;
          animation: fadeIn 1s 0.1s ease forwards;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (max-width: 480px) {
          .hero-scroll-indicator {
            display: none;
          }
        }
      `}</style>

      <section id="home" className="hero-section">
        <div className="hero-bg-wrap" ref={parallaxRef}>
          <img
            src="/black-poster.jpg"
            alt="AR Beauty Hair Salon"
            className="hero-bg-img"
          />
        </div>
        <div className="hero-overlay" />
        <div className="hero-overlay-bottom" />
        <div className="hero-gold-bar" />

        <div className="hero-content" ref={heroContentRef}>
          <span className="hero-eyebrow">Thornhill · Toronto</span>
          <h1 className="hero-title">
            AR <em>Beauty</em>
          </h1>
          <p className="hero-tagline">{t("hero.experience")}</p>
          <div className="hero-cta-wrap">
            <ScrollLink to="services" smooth={true} duration={700} className="hero-cta-primary">
              <span className="hero-cta-span">{t("navbar.services")}</span>
            </ScrollLink>
            <ScrollLink to="contact" smooth={true} duration={700} className="hero-cta-primary">
              <span className="hero-cta-span">{t("navbar.contact")}</span>
            </ScrollLink>
          </div>
        </div>

        <div className="hero-scroll-indicator">
          <span className="scroll-text">Scroll</span>
          <div className="scroll-line" />
        </div>
      </section>
    </>
  )
}

export default Hero