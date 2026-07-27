"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const IS_DEVELOPMENT = process.env.NODE_ENV === "development"
const MAKESHIFT_ANNOUNCEMENT = "✦  Welcome to AR Beauty · Professional Hair Salon in Thornhill, Toronto  ✦  Book your appointment today"

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(IS_DEVELOPMENT ? MAKESHIFT_ANNOUNCEMENT : "")
  const [isVisible, setIsVisible] = useState(IS_DEVELOPMENT)
  const [lastUpdate, setLastUpdate] = useState(null)
  const { language } = useLanguage()

  const fetchAnnouncement = async () => {
    if (IS_DEVELOPMENT) return
    try {
      const response = await fetch(`${API_URL}/api/announcement`)
      if (response.ok) {
        const data = await response.json()
        if (data.timestamp !== lastUpdate) {
          setAnnouncement(data.text)
          setLastUpdate(data.timestamp)
          setIsVisible(!!data.text)
        }
      }
    } catch (error) {
      console.error("Error fetching announcement:", error)
    }
  }

  useEffect(() => {
    if (!IS_DEVELOPMENT) {
      fetchAnnouncement()
      const interval = setInterval(fetchAnnouncement, 5000)
      return () => clearInterval(interval)
    }
  }, [lastUpdate])

  if (!isVisible || !announcement) return null

  return (
    <>
      <style>{`
        .announcement-bar {
          background: #c9a96e;
          overflow: hidden;
          position: relative;
          height: 36px;
          display: flex;
          align-items: center;
        }
        .announcement-track {
          display: flex;
          align-items: center;
          white-space: nowrap;
          animation: marquee-slide 28s linear infinite;
          flex-shrink: 0;
        }
        .announcement-text {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #0a0a0a;
          padding: 0 60px;
        }
        .announcement-close {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #0a0a0a;
          opacity: 0.7;
          padding: 4px;
          line-height: 1;
          transition: opacity 0.2s ease;
          z-index: 2;
          display: flex;
          align-items: center;
        }
        .announcement-close:hover { opacity: 1; }
        @keyframes marquee-slide {
          from { transform: translateX(100vw); }
          to { transform: translateX(-100%); }
        }
      `}</style>

      <div className="announcement-bar">
        <div className="announcement-track">
          <span className="announcement-text">{announcement}</span>
          <span className="announcement-text">{announcement}</span>
          <span className="announcement-text">{announcement}</span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="announcement-close"
          aria-label="Close announcement"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </>
  )
}

export default AnnouncementBanner
