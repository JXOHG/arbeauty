import React from "react"
import { FaInstagram } from "react-icons/fa"
import { SiKakaotalk } from "react-icons/si"
import { Link, useLocation } from "react-router-dom"
import { Link as ScrollLink } from "react-scroll"

const Footer = () => {
  const location = useLocation()

  const FooterNavItem = ({ to, children }) => {
    if (location.pathname === "/" && to !== "gallery") {
      return (
        <ScrollLink to={to} smooth={true} duration={700} className="footer-nav-link">
          {children}
        </ScrollLink>
      )
    }
    return (
      <Link to={to === "gallery" ? "/gallery" : `/#${to}`} className="footer-nav-link">
        {children}
      </Link>
    )
  }

  return (
    <>
      <style>{`
        .ar-footer {
          background: #0a0a0a;
          border-top: 1px solid rgba(201,169,110,0.12);
          padding: 60px 40px 32px;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: start;
          gap: 40px;
          padding-bottom: 48px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 32px;
        }
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .footer-wordmark {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: #fafaf8;
        }
        .footer-wordmark span { color: #c9a96e; font-style: italic; }
        .footer-tagline {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 300;
          letter-spacing: 0.15em;
          color: rgba(250,250,248,0.8);
          text-transform: uppercase;
        }
        .footer-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }
        .footer-gold-ornament {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .footer-gold-line-v {
          width: 1px;
          height: 32px;
          background: linear-gradient(to bottom, transparent, rgba(201,169,110,0.6));
        }
        .footer-gold-diamond {
          width: 6px;
          height: 6px;
          background: rgba(201,169,110,0.6);
          transform: rotate(45deg);
        }
        .footer-socials {
          display: flex;
          gap: 12px;
        }
        .footer-social {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(201,169,110,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(250,250,248,0.8);
          text-decoration: none;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .footer-social:hover {
          border-color: #c9a96e;
          color: #c9a96e;
        }
        .footer-nav {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }
        .footer-nav-link {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(250,250,248,0.8);
          text-decoration: none;
          cursor: pointer;
          transition: color 0.3s ease;
        }
        .footer-nav-link:hover { color: #c9a96e; }
        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }
        .footer-copy {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.1em;
          color: rgba(250,250,248,0.8);
        }
        .footer-address {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: rgba(250,250,248,0.8);
          text-align: right;
        }
        @media (max-width: 768px) {
          .ar-footer { padding: 48px 20px 24px; }
          .footer-top {
            grid-template-columns: 1fr;
            text-align: center;
          }
          .footer-brand { align-items: center; }
          .footer-nav { align-items: center; }
          .footer-bottom { justify-content: center; text-align: center; }
          .footer-address { text-align: center; }
        }
      `}</style>

      <footer className="ar-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <span className="footer-wordmark">
                AR <span>Beauty</span>
              </span>
              <span className="footer-tagline">Professional Hair Salon · Thornhill</span>
            </div>

            <div className="footer-center">
              <div className="footer-gold-ornament">
                <div className="footer-gold-line-v" />
                <div className="footer-gold-diamond" />
              </div>
              <div className="footer-socials">
                <a href="https://www.instagram.com/arbeauty2309" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="http://qr.kakao.com/talk/4Rtne7MaI3qby8p5eprZNyvFJ5w-" target="_blank" rel="noopener noreferrer" className="footer-social" aria-label="KakaoTalk">
                  <SiKakaotalk />
                </a>
              </div>
            </div>

            <nav className="footer-nav">
              <FooterNavItem to="home">Home</FooterNavItem>
              <FooterNavItem to="services">Services</FooterNavItem>
              <FooterNavItem to="staff">Team</FooterNavItem>
              <FooterNavItem to="location">Location</FooterNavItem>
              <FooterNavItem to="contact">Contact</FooterNavItem>
              <FooterNavItem to="gallery">Gallery</FooterNavItem>
            </nav>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">© 2026 AR Beauty Hair Salon. All rights reserved.</p>
            <p className="footer-address">Unit 103, 7191 Yonge St., Thornhill ON L3T 0C4</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer