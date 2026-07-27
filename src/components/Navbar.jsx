"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Link as ScrollLink } from "react-scroll"
import logo from "../images/logo.png"
import { useLanguage } from "../contexts/LanguageContext"

const Navbar = ({ isLoggedIn, onLogout, isAdminPage = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { language, toggleLanguage, t } = useLanguage()
  
  // Force scrolled state on admin page for visibility
  const showScrolledStyle = isScrolled || isAdminPage

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const NavItem = ({ to, children }) => {
    if (location.pathname === "/" && to !== "gallery") {
      return (
        <ScrollLink
          to={to}
          smooth={true}
          duration={700}
          className="nav-link"
          onClick={closeMenu}
        >
          {children}
        </ScrollLink>
      )
    }
    return (
      <Link
        to={to === "gallery" ? "/gallery" : `/#${to}`}
        className="nav-link"
        onClick={closeMenu}
      >
        {children}
      </Link>
    )
  }

  return (
    <>
      <style>{`
        .ar-navbar {
          position: relative;
          z-index: 100;
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background: transparent;
        }
        .ar-navbar.scrolled {
          background: rgba(10, 10, 10, 0.97);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(201, 169, 110, 0.15);
        }
        .ar-navbar.menu-open {
          background: rgba(10, 10, 10, 0.99);
        }
        .navbar-inner {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
          transition: height 0.4s ease;
        }
        .scrolled .navbar-inner { height: 64px; }
        .navbar-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .navbar-logo {
          width: 36px;
          height: 36px;
          object-fit: contain;
          filter: brightness(1);
          transition: transform 0.3s ease;
        }
        .navbar-brand:hover .navbar-logo { transform: rotate(-5deg) scale(1.05); }
        .navbar-wordmark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #fafaf8;
          text-transform: uppercase;
        }
        .navbar-nav {
          display: flex;
          align-items: center;
          gap: 0;
          list-style: none;
        }
        .nav-link {
          display: block;
          padding: 8px 18px;
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(250, 250, 248, 0.8);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 18px;
          right: 18px;
          height: 1px;
          background: #c9a96e;
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: left;
        }
        .nav-link:hover { color: #c9a96e; }
        .nav-link:hover::after { transform: scaleX(1); }
        .nav-lang-btn {
          padding: 6px 16px;
          background: transparent;
          border: 1px solid rgba(201, 169, 110, 0.5);
          color: #c9a96e;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-left: 8px;
        }
        .nav-lang-btn:hover {
          background: rgba(201, 169, 110, 0.15);
          border-color: #c9a96e;
        }
        .hamburger-btn {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
        }
        .hamburger-line {
          width: 24px;
          height: 1px;
          background: #fafaf8;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hamburger-btn.open .hamburger-line:nth-child(1) {
          transform: translateY(6px) rotate(45deg);
        }
        .hamburger-btn.open .hamburger-line:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }
        .hamburger-btn.open .hamburger-line:nth-child(3) {
          transform: translateY(-6px) rotate(-45deg);
        }

        @media (max-width: 900px) {
          .navbar-inner { padding: 0 20px; }
          .hamburger-btn { display: flex; }
          .navbar-nav {
            position: fixed;
            top: 0; right: 0;
            height: 100vh;
            width: min(320px, 85vw);
            background: #0a0a0a;
            border-left: 1px solid rgba(201,169,110,0.15);
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            padding: 80px 40px 40px;
            gap: 4px;
            transform: translateX(100%);
            transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          .navbar-nav.open { transform: translateX(0); }
          .nav-link {
            font-size: 1rem;
            padding: 12px 0;
            width: 100%;
          }
          .nav-link::after { left: 0; right: 0; }
          .nav-lang-btn {
            margin-left: 0;
            margin-top: 16px;
            width: 100%;
            text-align: center;
            padding: 10px;
          }
          .menu-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            z-index: -1;
            opacity: 1;
          }
        }
      `}</style>

      <nav className={`ar-navbar ${showScrolledStyle ? "scrolled" : ""} ${isMenuOpen ? "menu-open" : ""}`}>
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand" onClick={closeMenu}>
            <img src={logo || "/placeholder.svg"} alt="AR Beauty" className="navbar-logo" />
            <span className="navbar-wordmark">AR Beauty</span>
          </Link>

          <button
            className={`hamburger-btn ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>

          <ul className={`navbar-nav ${isMenuOpen ? "open" : ""}`}>
            {isMenuOpen && <div className="menu-overlay" onClick={closeMenu} />}
            <li><NavItem to="home">{t("navbar.home")}</NavItem></li>
            <li><NavItem to="services">{t("navbar.services")}</NavItem></li>
            <li><NavItem to="staff">{t("navbar.staff")}</NavItem></li>
            <li><NavItem to="location">{t("navbar.location")}</NavItem></li>
            <li><NavItem to="contact">{t("navbar.contact")}</NavItem></li>
            <li><NavItem to="gallery">{t("navbar.gallery")}</NavItem></li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/admin" className="nav-link" onClick={closeMenu}>
                    {t("navbar.admin")}
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => { onLogout(); closeMenu() }}
                    className="nav-link"
                    style={{ background: "none", border: "none", width: "100%", textAlign: "left" }}
                  >
                    {t("navbar.logout")}
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="nav-link" onClick={closeMenu}>
                  {t("navbar.login")}
                </Link>
              </li>
            )}
            <li>
              <button onClick={toggleLanguage} className="nav-lang-btn">
                {language === "en-US" ? "한국어" : "English"}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar
