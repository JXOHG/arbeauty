"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const ServicesManager = () => {
  const [services, setServices] = useState({})
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const isKorean = language === "ko-KR"

  useEffect(() => {
    fetchServices()
  }, [language])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/services`)
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
      setError(isKorean ? t("admin.error") : "Failed to load services")
    }
  }

  const handleServiceChange = (category, index, field, value) => {
    setServices((prev) => ({
      ...prev,
      [category]: prev[category].map((service, i) => (i === index ? { ...service, [field]: value } : service)),
    }))
    setError("")
    setSuccess("")
  }

  const addNewService = (category) => {
    setServices((prev) => {
      // If category doesn't exist yet, create a new array
      if (!prev[category]) {
        return {
          ...prev,
          [category]: [{ name: "", price: "" }],
        }
      }

      // Otherwise add to existing category
      return {
        ...prev,
        [category]: [...prev[category], { name: "", price: "" }],
      }
    })
    setError("")
    setSuccess("")
  }

  const deleteService = (category, index) => {
    if (window.confirm(isKorean ? t("admin.deleteServiceConfirm") : "Are you sure you want to delete this service?")) {
      setServices((prev) => {
        const updatedCategory = [...prev[category]]
        updatedCategory.splice(index, 1)

        // If this was the last service in the category, return without the category
        if (updatedCategory.length === 0) {
          const newServices = { ...prev }
          delete newServices[category]
          return newServices
        }

        return {
          ...prev,
          [category]: updatedCategory,
        }
      })
      setError("")
      setSuccess("")
    }
  }

  const deleteCategory = (category) => {
    const confirmMessage = isKorean
      ? t("admin.deleteCategoryConfirm").replace("{category}", category)
      : `Are you sure you want to delete the entire "${category}" category and all its services?`
    
    if (window.confirm(confirmMessage)) {
      setServices((prev) => {
        const newServices = { ...prev }
        delete newServices[category]
        return newServices
      })
      setError("")
      setSuccess("")
    }
  }

  const addNewCategory = () => {
    const categoryName = prompt(isKorean ? t("admin.enterCategoryName") : "Enter new category name:")
    if (categoryName && categoryName.trim() !== "") {
      setServices((prev) => ({
        ...prev,
        [categoryName.trim()]: [{ name: "", price: "" }],
      }))
    }
  }

  const saveServices = async () => {
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch(`${API_URL}/api/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ services }),
      })

      if (response.ok) {
        setSuccess(isKorean ? t("admin.servicesSuccess") : "Services saved successfully!")
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        } else {
          const data = await response.json()
          setError(data.error || (isKorean ? t("admin.error") : "Failed to save services"))
        }
      }
    } catch (error) {
      setError(isKorean ? t("admin.networkError") : "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{isKorean ? t("admin.manageServices") : "Manage Services"}</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
      )}

      {Object.entries(services).map(([category, categoryServices]) => (
        <div key={category} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold">{category}</h3>
            <button
              onClick={() => deleteCategory(category)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
              title={isKorean ? t("admin.deleteCategory") : "Delete category"}
            >
              🗑️
            </button>
          </div>

          {categoryServices.map((service, index) => (
            <div key={index} className="flex gap-4 mb-2 items-center">
              <input
                type="text"
                value={service.name}
                onChange={(e) => handleServiceChange(category, index, "name", e.target.value)}
                className="flex-1 shadow-sm focus:ring-black focus:border-black block sm:text-sm border-gray-300 rounded-md"
                placeholder={isKorean ? t("admin.serviceName") : "Service name"}
              />
              <input
                type="text"
                value={service.price}
                onChange={(e) => handleServiceChange(category, index, "price", e.target.value)}
                className="w-40 shadow-sm focus:ring-black focus:border-black block sm:text-sm border-gray-300 rounded-md"
                placeholder={isKorean ? t("admin.price") : "Price"}
              />
              <button
                onClick={() => deleteService(category, index)}
                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                title={isKorean ? t("admin.deleteService") : "Delete service"}
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={() => addNewService(category)}
            className="mt-2 text-black border border-black px-3 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            + {isKorean ? t("admin.addService") : "Add Service"}
          </button>
        </div>
      ))}

      <div className="flex gap-4 mt-4 mb-6">
        <button
          onClick={addNewCategory}
          className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-gray-300 transition-colors duration-200"
        >
          + {isKorean ? t("admin.addCategory") : "Add New Category"}
        </button>
      </div>

      <button
        onClick={saveServices}
        disabled={loading}
        className={`bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200 w-full ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? (isKorean ? t("admin.saving") : "Saving...") : isKorean ? t("admin.saveServices") : "Save Services"}
      </button>
    </div>
  )
}

export default ServicesManager
