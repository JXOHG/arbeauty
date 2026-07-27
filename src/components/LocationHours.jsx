"use client"

import { useState, useEffect, useRef } from "react"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const LocationHours = () => {
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(true)
  const { t, language } = useLanguage()
  const sectionRef = useRef(null)

  const defaultHours = [
    { day: "Monday", time: "CLOSED" },
    { day: "Tuesday", time: "10:30 AM - 7:30 PM" },
    { day: "Wednesday", time: "10:30 AM - 7:30 PM" },
    { day: "Thursday", time: "02:30 PM - 7:30 PM" },
    { day: "Friday", time: "10:30 AM - 7:30 PM" },
    { day: "Saturday", time: "10:30 AM - 6:30 PM" },
    { day: "Sunday", time: "10:30 AM - 6:30 PM" },
  ]

  useEffect(() => { fetchHours() }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [hours])

  const fetchHours = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hours`)
      if (response.ok) {
        const data = await response.json()
        setHours(data)
      } else {
        setHours(defaultHours)
      }
    } catch (error) {
      setHours(defaultHours)
    } finally {
      setLoading(false)
    }
  }

  const mapUrl = "https://maps.app.goo.gl/TtBD6ZsdoMM7RCEa8"

  const getDayTranslation = (day) => {
    const dayLower = day.toLowerCase()
    return t(`days.${dayLower}`)
  }

  // Get today's day name
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })

  return (
    <>
      <style>{`
        .location-section {
          background: #fafaf8;
          position: relative;
        }
        .location-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 40px;
        }
        .location-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .location-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a96e;
          display: block;
          margin-bottom: 16px;
        }
        .location-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          color: #0a0a0a;
          line-height: 1.05;
        }
        .location-title em { font-style: italic; color: #c9a96e; }
        .location-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          align-items: start;
          margin-bottom: 60px;
        }
        .location-block-label {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c9a96e;
          margin-bottom: 24px;
          display: block;
        }
        .location-address {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 300;
          color: #0a0a0a;
          line-height: 1.6;
          margin-bottom: 8px;
        }
        .location-phone {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          color: #555050;
          letter-spacing: 0.05em;
          margin-bottom: 32px;
        }
        .location-map-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 32px;
          background: #0a0a0a;
          color: #fafaf8;
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.35s ease;
          border: 1px solid #0a0a0a;
        }
        .location-map-btn:hover {
          background: transparent;
          color: #0a0a0a;
        }
        .location-map-btn svg { transition: transform 0.3s ease; }
        .location-map-btn:hover svg { transform: translateX(4px); }
        .hours-list { list-style: none; }
        .hours-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          transition: background 0.2s ease;
          margin: 0 -12px;
          padding-left: 12px;
          padding-right: 12px;
          border-radius: 4px;
        }
        .hours-item.today {
          background: rgba(201,169,110,0.08);
          border-bottom-color: rgba(201,169,110,0.2);
        }
        .hours-item:last-child { border-bottom: none; }
        .hours-day {
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: #555050;
          text-transform: uppercase;
        }
        .hours-item.today .hours-day { color: #c9a96e; font-weight: 500; }
        .hours-time {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem;
          font-weight: 500;
          color: #0a0a0a;
          letter-spacing: 0.02em;
        }
        .hours-item.today .hours-time { color: #0a0a0a; }
        .hours-time.closed {
          font-family: 'Jost', sans-serif;
          font-size: 0.75rem;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #9a9590;
        }
        .today-badge {
          font-family: 'Jost', sans-serif;
          font-size: 0.55rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #0a0a0a;
          background: #c9a96e;
          padding: 2px 8px;
          border-radius: 2px;
        }
        .location-map-wrap {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.08);
        }
        .location-map-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          border: 6px solid #fafaf8;
          z-index: 1;
          pointer-events: none;
        }
        .location-map-wrap iframe { display: block; }
        @media (max-width: 768px) {
          .location-inner { padding: 80px 20px; }
          .location-grid { grid-template-columns: 1fr; gap: 48px; }
        }
      `}</style>

      <section id="location" className="location-section" ref={sectionRef}>
        <div className="location-inner">
          <div className="location-header reveal">
            <span className="location-eyebrow">Find Us</span>
            <h2 className="location-title">
              Location &amp; <em>Hours</em>
            </h2>
          </div>

          <div className="location-grid">
            <div className="reveal-left">
              <span className="location-block-label">Our Location</span>
              <p className="location-address">
                Unit 103, 7191 Yonge St.<br />
                Thornhill, ON L3T 0C4
              </p>
              <p className="location-phone">Phone: (437) 365-4320</p>
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="location-map-btn">
                <span>{t("location.viewOnGoogleMaps")}</span>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>

            <div className="reveal-right">
              <span className="location-block-label">{t("location.storeHours")}</span>
              {loading ? (
                <p style={{ color: "#9a9590", fontFamily: "'Jost', sans-serif", fontSize: "0.875rem" }}>
                  {t("location.loading")}
                </p>
              ) : (
                <ul className="hours-list">
                  {hours.map((item, index) => {
                    const isToday = item.day === today
                    const isClosed = item.time.toUpperCase() === "CLOSED"
                    return (
                      <li key={item.id || index} className={`hours-item ${isToday ? "today" : ""}`}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <span className="hours-day">
                            {language === "ko-KR" ? getDayTranslation(item.day) : item.day}
                          </span>
                          {isToday && <span className="today-badge">Today</span>}
                        </div>
                        <span className={`hours-time ${isClosed ? "closed" : ""}`}>{item.time}</span>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          </div>

          <div className="reveal">
            <div className="location-map-wrap">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.5301160143495!2d-79.4206894!3d43.8033624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2d7ede834fdf%3A0x62d8a63fd240f8ff!2zQVIgQkVBVVRZIEhBSVIgU0FMT04g66-47Jqp7Iuk!5e0!3m2!1sen!2sca!4v1735239049810!5m2!1sen!2sca"
                width="100%"
                height="380"
                style={{ border: 0, display: "block" }}
                allowFullScreen=""
                loading="lazy"
                title="AR Beauty Hair Salon Location"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LocationHours