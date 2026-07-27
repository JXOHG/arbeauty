"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"
import { useToastContext } from "./AdminConsole"

const HoursManager = () => {
  const navigate = useNavigate()
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { language, t } = useLanguage()
  const isKorean = language === "ko-KR"
  const { showSuccess, showError } = useToastContext()

  useEffect(() => {
    fetchHours()
  }, [])

  const fetchHours = async () => {
    try {
      const response = await fetch(`${API_URL}/api/hours`)
      if (response.ok) {
        const data = await response.json()
        setHours(data)
      } else {
        showError(isKorean ? t("admin.error") : "Failed to load store hours")
      }
    } catch (error) {
      showError(isKorean ? t("admin.error") : "Failed to load store hours")
    } finally {
      setLoading(false)
    }
  }

  const handleHourChange = (index, field, value) => {
    const updatedHours = [...hours]
    updatedHours[index] = {
      ...updatedHours[index],
      [field]: value,
    }
    setHours(updatedHours)
  }

  const saveHours = async () => {
    setSaving(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch(`${API_URL}/api/hours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hours }),
      })

      if (response.ok) {
        showSuccess(isKorean ? t("admin.hoursSuccess") : "Store hours updated successfully!")
        fetchHours() // Refresh the hours after saving
      } else {
        const data = await response.json()
        showError(data.error || (isKorean ? t("admin.error") : "Failed to update store hours"))
      }
    } catch (error) {
      showError(isKorean ? t("admin.networkError") : "Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{isKorean ? t("admin.manageHours") : "Manage Store Hours"}</h2>
        <div className="text-gray-600">{isKorean ? t("admin.loading") : "Loading store hours..."}</div>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{isKorean ? t("admin.manageHours") : "Manage Store Hours"}</h2>
      <div className="space-y-4">
        {hours.map((hour, index) => (
          <div key={hour.id || index} className="flex gap-4">
            <input
              type="text"
              value={hour.day}
              onChange={(e) => handleHourChange(index, "day", e.target.value)}
              className="w-1/3 p-2 border rounded"
            />
            <input
              type="text"
              value={hour.time}
              onChange={(e) => handleHourChange(index, "time", e.target.value)}
              className="w-2/3 p-2 border rounded"
            />
          </div>
        ))}
      </div>
      <button
        onClick={saveHours}
        disabled={saving}
        className={`mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 w-full ${
          saving ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {saving ? (isKorean ? t("admin.saving") : "Saving...") : isKorean ? t("admin.saveHours") : "Save Store Hours"}
      </button>
    </div>
  )
}

export default HoursManager
