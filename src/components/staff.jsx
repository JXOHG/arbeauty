"use client"

import { useState, useEffect, useRef } from "react"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()
  const parallaxRef = useRef(null)
  const sectionRef = useRef(null)

  const defaultStaff = [
    { name: "Rachel", role: "Representative, Lead Hairstylist", email: "" },
    { name: "Ashley", role: "Manager, Hairstylist", email: "" },
    { name: "Hannah", role: "Hairstylist", email: "" },
    { name: "Stella", role: "Hairstylist", email: "" },
  ]

  useEffect(() => {
    fetchStaff()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 }
    )
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [staffMembers])

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current || !sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = -rect.top / (rect.height + window.innerHeight)
      parallaxRef.current.style.transform = `translateY(${progress * 80}px) scale(1.12)`
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${API_URL}/api/staff`)
      if (response.ok) {
        const data = await response.json()
        setStaffMembers(data)
      } else {
        setStaffMembers(defaultStaff)
      }
    } catch (error) {
      setStaffMembers(defaultStaff)
    } finally {
      setLoading(false)
    }
  }

  // Generate initials for the avatar
  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "?"

  return (
    <>
      <style>{`
        .staff-section {
          position: relative;
          overflow: hidden;
          background: #fafaf8;
        }
        .staff-parallax-strip {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: #0a0a0a;
          will-change: transform;
        }
        .staff-inner {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 40px;
        }
        .staff-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .staff-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a96e;
          display: block;
          margin-bottom: 16px;
        }
        .staff-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          color: #fafaf8;
          line-height: 1.05;
        }
        .staff-title em { font-style: italic; color: #c9a96e; }
        .staff-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2px;
        }
        .staff-card {
          background: #fafaf8;
          padding: 48px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
          transition: transform 0.4s ease, box-shadow 0.4s ease;
          border: 1px solid rgba(0,0,0,0.06);
        }
        .staff-card::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(to right, transparent, #c9a96e, transparent);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }
        .staff-card:hover { transform: translateY(-8px); box-shadow: 0 24px 60px rgba(0,0,0,0.12); }
        .staff-card:hover::before { transform: scaleX(1); }
        .staff-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1a1a1a, #333);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          flex-shrink: 0;
        }
        .staff-avatar::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.3);
        }
        .staff-initial {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 400;
          color: #c9a96e;
          line-height: 1;
        }
        .staff-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.5rem;
          font-weight: 500;
          color: #0a0a0a;
          text-align: center;
          letter-spacing: 0.02em;
        }
        .staff-role {
          font-family: 'Jost', sans-serif;
          font-size: 0.72rem;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #9a9590;
          text-align: center;
          line-height: 1.5;
        }
        .staff-email {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          color: #c9a96e;
          text-align: center;
        }
        @media (max-width: 600px) {
          .staff-inner { padding: 80px 16px; }
          .staff-grid { grid-template-columns: 1fr 1fr; gap: 2px; }
          .staff-card { padding: 32px 16px; }
        }
      `}</style>

      <section id="staff" className="staff-section" ref={sectionRef}>
        <div className="staff-parallax-strip" ref={parallaxRef} />

        <div className="staff-inner">
          <div className="staff-header reveal">
            <span className="staff-eyebrow">{t("staff.eyebrow")}</span>
<h2 className="staff-title">
  {language === "en-US" ? (
    <>Meet Our <em>Team</em></>
  ) : (
    t("staff.teamTitle")
  )}
</h2>
          </div>

          {loading ? (
            <p style={{ textAlign: "center", color: "#9a9590", fontFamily: "'Jost', sans-serif" }}>
              {t("staff.loading")}
            </p>
          ) : (
            <div className="staff-grid">
              {staffMembers.map((member, index) => (
                <div
                  key={member.id || index}
                  className="staff-card reveal"
                  style={{ transitionDelay: `${index * 0.1}s` }}
                >
                  <div className="staff-avatar">
                    <span className="staff-initial">{getInitials(member.name)}</span>
                  </div>
                  <h3 className="staff-name">{member.name}</h3>
                  <p className="staff-role">{member.role}</p>
                  {member.email && <p className="staff-email">{member.email}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Staff