"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { t } = useLanguage()

  // Default staff data to use if API call fails
  const defaultStaff = [
    { name: "Rachel", role: "Representative, Lead Hairstylist", email: "" },
    { name: "Ashley", role: "Manager, hairstylist", email: "" },
    { name: "Hannah", role: "Hairstylist", email: "" },
    { name: "Stella", role: "Hairstylist", email: "" },
  ]

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${API_URL}/api/staff`)
      if (response.ok) {
        const data = await response.json()
        setStaffMembers(data)
      } else {
        // If backend request fails, use default staff data
        setStaffMembers(defaultStaff)
      }
    } catch (error) {
      // If there's any error, use default staff data
      setStaffMembers(defaultStaff)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section id="staff" className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">{t("staff.title")}</h2>
          <p className="text-center">{t("staff.loading")}</p>
        </div>
      </section>
    )
  }

  return (
    <section id="staff" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">{t("staff.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {staffMembers.map((member, index) => (
            <div key={member.id || index} className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-gray-600 text-center">{member.role}</p>
              {member.email && <p className="text-gray-600 mt-2">{member.email}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Staff
