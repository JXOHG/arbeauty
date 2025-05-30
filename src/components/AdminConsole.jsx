"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import GalleryManager from "./GalleryManager"
import HoursManager from "./HoursManager"
import ServicesManager from "./ServicesManager"
import StaffManager from "./StaffManager"
import TranslationHelper from "./TranslationHelper"
import { useLanguage } from "../contexts/LanguageContext"

const AnnouncementManager = () => {
  const [announcement, setAnnouncement] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const isKorean = language === "ko-KR"

  useEffect(() => {
    fetchAnnouncement()
  }, [])

  const fetchAnnouncement = async () => {
    try {
      const response = await fetch(`${API_URL}/api/announcement`)
      if (response.ok) {
        const data = await response.json()
        setAnnouncement(data.text || "")
      }
    } catch (error) {
      console.error("Error fetching announcement:", error)
      setError(isKorean ? t("admin.error") : "Failed to load current announcement")
    }
  }

  const handleAnnouncementChange = (e) => {
    setAnnouncement(e.target.value)
    setError("")
    setSuccess("")
  }

  const saveAnnouncement = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch(`${API_URL}/api/announcement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: announcement }),
      })

      if (response.ok) {
        setSuccess(isKorean ? t("admin.announcementSuccess") : "Announcement saved successfully!")
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        } else {
          const data = await response.json()
          setError(data.error || (isKorean ? t("admin.announcementError") : "Failed to save announcement"))
        }
      }
    } catch (error) {
      setError(isKorean ? t("admin.networkError") : "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{isKorean ? t("admin.manageAnnouncement") : "Manage Announcement"}</h1>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
        )}
        <div className="mb-4">
          <label htmlFor="announcement" className="block text-sm font-medium text-gray-700 mb-2">
            {isKorean ? t("admin.announcementText") : "Announcement Text"}
          </label>
          <textarea
            id="announcement"
            rows="3"
            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
            value={announcement}
            onChange={handleAnnouncementChange}
            placeholder={isKorean ? t("admin.enterAnnouncement") : "Enter your announcement here..."}
          ></textarea>
        </div>
        <button
          onClick={saveAnnouncement}
          disabled={loading}
          className={`bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 w-full ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading
            ? isKorean
              ? t("admin.saving")
              : "Saving..."
            : isKorean
            ? t("admin.saveAnnouncement")
            : "Save Announcement"}
        </button>

        <GalleryManager />
        <HoursManager />
        <ServicesManager />
        <StaffManager />
        <TranslationHelper />
      </div>
    </div>
  )
}

export default AnnouncementManager
