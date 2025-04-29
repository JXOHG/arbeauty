"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const IS_DEVELOPMENT = process.env.NODE_ENV === "development"
const MAKESHIFT_ANNOUNCEMENT = "🎉 Welcome to our new platform! Explore our latest features and let us know what you think. 🚀"

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(IS_DEVELOPMENT ? MAKESHIFT_ANNOUNCEMENT : "")
  const [isVisible, setIsVisible] = useState(IS_DEVELOPMENT)
  const [lastUpdate, setLastUpdate] = useState(null)
  const { language } = useLanguage()

  const fetchAnnouncement = async () => {
    if (IS_DEVELOPMENT) return // Skip API call in development

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
    <div className="bg-white text-black py-2 px-4 overflow-hidden border-t border-b border-gray-200">
      <div className="container mx-auto">
        <div className="overflow-hidden flex justify-between items-center">
          <div className="animate-slide whitespace-nowrap inline-block">
            <span className="inline-block px-4 text-3xl font-bold">{announcement}</span>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-black hover:text-gray-600 focus:outline-none"
            aria-label="Close announcement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default AnnouncementBanner
