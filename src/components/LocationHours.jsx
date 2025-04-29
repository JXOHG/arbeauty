"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const LocationHours = () => {
  const [hours, setHours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { t, language } = useLanguage()

  const defaultHours = [
    { day: "Monday", time: "CLOSED" },
    { day: "Tuesday", time: "10:30 AM - 7:30 PM" },
    { day: "Wednesday", time: "10:30 AM - 7:30 PM" },
    { day: "Thursday", time: "02:30 PM - 7:30 PM" },
    { day: "Friday", time: "10:30 PM - 7:30 PM" },
    { day: "Saturday", time: "10:30 AM - 6:30 PM" },
    { day: "Sunday", time: "10:30 AM - 6:30 PM" },
  ]

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
        // If backend request fails, use default hours
        setHours(defaultHours)
      }
    } catch (error) {
      // If there's any error, use default hours
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

  if (loading) {
    return (
      <div className="py-16 md:py-20 bg-white text-center">
        <div className="container mx-auto px-4">
          <p>{t("location.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <section id="location" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">{t("location.title")}</h2>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <h3 className="text-xl font-semibold mb-4">{t("location.ourLocation")}</h3>
            <p>Unit 103, 7191 Yonge St.</p>
            <p>Thornhill, ON L3T 0C4</p>
            <p>Phone: (437) 365-4320</p>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
            >
              {t("location.viewOnGoogleMaps")}
            </a>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-xl font-semibold mb-4">{t("location.storeHours")}</h3>
            <ul className="space-y-2">
              {hours.map((item, index) => (
                <li key={item.id || index} className="flex justify-between">
                  <span className="font-medium">{language === "ko-KR" ? getDayTranslation(item.day) : item.day}:</span>
                  <span>{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.5301160143495!2d-79.4206894!3d43.8033624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2d7ede834fdf%3A0x62d8a63fd240f8ff!2zQVIgQkVBVVRZIEhBSVIgU0FMT04g66-47Jqp7Iuk!5e0!3m2!1sen!2sca!4v1735239049810!5m2!1sen!2sca"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="AR Beauty Hair Salon Location"
          ></iframe>
        </div>
      </div>
    </section>
  )
}

export default LocationHours
