"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"
import { useToastContext } from "./AdminConsole"
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react"

const ServicesManager = () => {
  const [services, setServices] = useState({})
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(null)
  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const isKorean = language === "ko-KR"
  const fileInputRefs = useRef({})
  const { showSuccess, showError } = useToastContext()

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
      showError(isKorean ? t("admin.error") : "Failed to load services")
    }
  }

  const handleServiceChange = (category, index, field, value) => {
    setServices((prev) => ({
      ...prev,
      [category]: prev[category].map((service, i) => (i === index ? { ...service, [field]: value } : service)),
    }))
  }

  const addNewService = (category) => {
    setServices((prev) => {
      if (!prev[category]) {
        return {
          ...prev,
          [category]: [{ name: "", price: "" }],
        }
      }
      return {
        ...prev,
        [category]: [...prev[category], { name: "", price: "" }],
      }
    })
  }

  const deleteService = (category, index) => {
    if (window.confirm(isKorean ? t("admin.deleteServiceConfirm") : "Are you sure you want to delete this service?")) {
      setServices((prev) => {
        const updatedCategory = [...prev[category]]
        updatedCategory.splice(index, 1)

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

  const handleImageUpload = async (category, index, file) => {
    if (!file) return

    const uploadKey = `${category}-${index}`
    setUploadingImage(uploadKey)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const formData = new FormData()
      formData.append("image", file)

      const response = await fetch(`${API_URL}/api/services/${encodeURIComponent(category)}/${index}/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setServices((prev) => ({
          ...prev,
          [category]: prev[category].map((service, i) =>
            i === index
              ? { ...service, imageUrl: data.imageUrl, imagePublicId: data.imagePublicId }
              : service
          ),
        }))
        showSuccess(isKorean ? "이미지가 업로드되었습니다" : "Image uploaded successfully!")
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        } else {
          const data = await response.json()
          showError(data.error || (isKorean ? t("admin.error") : "Failed to upload image"))
        }
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      showError(isKorean ? t("admin.networkError") : "Network error. Please try again.")
    } finally {
      setUploadingImage(null)
    }
  }

  const handleImageDelete = async (category, index) => {
    if (!window.confirm(isKorean ? "이미지를 삭제하시겠습니까?" : "Are you sure you want to delete this image?")) {
      return
    }

    const uploadKey = `${category}-${index}`
    setUploadingImage(uploadKey)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch(`${API_URL}/api/services/${encodeURIComponent(category)}/${index}/image`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setServices((prev) => ({
          ...prev,
          [category]: prev[category].map((service, i) => {
            if (i === index) {
              const { imageUrl, imagePublicId, ...rest } = service
              return rest
            }
            return service
          }),
        }))
        showSuccess(isKorean ? "이미지가 삭제되었습니다" : "Image deleted successfully!")
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        } else {
          const data = await response.json()
          showError(data.error || (isKorean ? t("admin.error") : "Failed to delete image"))
        }
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      showError(isKorean ? t("admin.networkError") : "Network error. Please try again.")
    } finally {
      setUploadingImage(null)
    }
  }

  const saveServices = async () => {
    setLoading(true)

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
        showSuccess(isKorean ? t("admin.servicesSuccess") : "Services saved successfully!")
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        } else {
          const data = await response.json()
          showError(data.error || (isKorean ? t("admin.error") : "Failed to save services"))
        }
      }
    } catch (error) {
      showError(isKorean ? t("admin.networkError") : "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{isKorean ? t("admin.manageServices") : "Manage Services"}</h2>

      {Object.entries(services).map(([category, categoryServices]) => (
        <div key={category} className="mb-6 p-4 border border-gray-200 rounded-lg">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold">{category}</h3>
            <button
              onClick={() => deleteCategory(category)}
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
              title={isKorean ? t("admin.deleteCategory") : "Delete category"}
            >
              {"🗑️"}
            </button>
          </div>

          {categoryServices.map((service, index) => {
            const uploadKey = `${category}-${index}`
            const isUploading = uploadingImage === uploadKey

            return (
              <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex gap-4 mb-2 items-center">
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
                    {"✕"}
                  </button>
                </div>

                {/* Image upload section */}
                <div className="mt-2 flex items-center gap-3">
                  {service.imageUrl ? (
                    <div className="relative group">
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-20 h-20 object-cover rounded-md border border-gray-200"
                      />
                      <button
                        onClick={() => handleImageDelete(category, index)}
                        disabled={isUploading}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                        title={isKorean ? "이미지 삭제" : "Delete image"}
                      >
                        <X className="w-3 h-3" />
                      </button>
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
                          <Loader2 className="w-5 h-5 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            handleImageUpload(category, index, file)
                          }
                          e.target.value = ""
                        }}
                        disabled={isUploading}
                      />
                      <div
                        className={`w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-gray-400 hover:text-gray-500 transition-colors duration-200 ${
                          isUploading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {isUploading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <ImageIcon className="w-5 h-5 mb-1" />
                            <span className="text-xs">{isKorean ? "사진" : "Photo"}</span>
                          </>
                        )}
                      </div>
                    </label>
                  )}
                  <span className="text-xs text-gray-500">
                    {isKorean ? "(선택사항) 서비스 사진 추가" : "(Optional) Add a photo for this service"}
                  </span>
                </div>
              </div>
            )
          })}

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
