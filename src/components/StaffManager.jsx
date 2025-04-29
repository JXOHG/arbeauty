"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const StaffManager = () => {
  const navigate = useNavigate()
  const [staff, setStaff] = useState([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    fetchStaff()
  }, [])

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${API_URL}/api/staff`)
      if (response.ok) {
        const data = await response.json()
        setStaff(data)
      } else {
        setError(t("admin.error"))
      }
    } catch (error) {
      setError(t("admin.error"))
    } finally {
      setLoading(false)
    }
  }

  const handleStaffChange = (index, field, value) => {
    const updatedStaff = [...staff]
    updatedStaff[index] = {
      ...updatedStaff[index],
      [field]: value,
    }
    setStaff(updatedStaff)
    setError("")
    setSuccess("")
  }

  const addStaffMember = () => {
    setStaff([...staff, { name: "", role: "", email: "" }])
  }

  const removeStaffMember = (index) => {
    const updatedStaff = [...staff]
    updatedStaff.splice(index, 1)
    setStaff(updatedStaff)
    setError("")
    setSuccess("")
  }

  const saveStaff = async () => {
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      // Validate that all staff members have at least a name and role
      const isValid = staff.every((member) => member.name.trim() && member.role.trim())
      if (!isValid) {
        setError(t("admin.staffValidationError"))
        setSaving(false)
        return
      }

      const response = await fetch(`${API_URL}/api/staff`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ staff }),
      })

      if (response.ok) {
        setSuccess(t("admin.success"))
        fetchStaff() // Refresh the staff after saving
      } else {
        const data = await response.json()
        setError(data.error || t("admin.error"))
      }
    } catch (error) {
      setError(t("admin.networkError"))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{t("admin.manageStaff")}</h2>
        <div className="text-gray-600">{t("admin.loading")}</div>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{t("admin.manageStaff")}</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
      )}
      <div className="space-y-4">
        {staff.map((member, index) => (
          <div key={member.id || index} className="p-4 border rounded-md bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">
                {t("admin.staffMember")} #{index + 1}
              </h3>
              <button onClick={() => removeStaffMember(index)} className="text-red-500 hover:text-red-700">
                {t("admin.remove")}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.staffName")}</label>
                <input
                  type="text"
                  value={member.name}
                  onChange={(e) => handleStaffChange(index, "name", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder={t("admin.staffName")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.staffRole")}</label>
                <input
                  type="text"
                  value={member.role}
                  onChange={(e) => handleStaffChange(index, "role", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder={t("admin.staffRole")}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">{t("admin.staffEmail")}</label>
                <input
                  type="email"
                  value={member.email}
                  onChange={(e) => handleStaffChange(index, "email", e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder={t("admin.staffEmail")}
                />
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={addStaffMember}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors duration-200 w-full"
        >
          + {t("admin.addStaffMember")}
        </button>
      </div>
      <button
        onClick={saveStaff}
        disabled={saving}
        className={`mt-4 bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 w-full ${
          saving ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {saving ? t("admin.saving") : t("admin.saveStaffData")}
      </button>
    </div>
  )
}

export default StaffManager
