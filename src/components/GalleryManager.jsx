"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../config"
import { Loader2 } from 'lucide-react'
import heic2any from "heic2any"
import LazyImage from "./LazyImage"
import { useLanguage } from "../contexts/LanguageContext"

const GalleryManager = () => {
  const [images, setImages] = useState([])
  const [newImage, setNewImage] = useState(null)
  const [newImageAlt, setNewImageAlt] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_FORMATS = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"]
  const { language, t } = useLanguage()
  const isKorean = language === "ko-KR"

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/gallery`)
      if (response.ok) {
        const data = await response.json()
        setImages(data)
      } else {
        const errorData = await response.json()
        setError(errorData.error || (isKorean ? t("admin.error") : "Failed to fetch images"))
      }
    } catch (error) {
      setError(isKorean ? t("admin.error") : "Error fetching images")
      console.error("Error fetching images:", error)
    }
  }

  const validateImage = (file) => {
    if (!file) {
      throw new Error(isKorean ? t("admin.selectImage") : "Please select an image to upload")
    }

    if (!ALLOWED_FORMATS.includes(file.type)) {
      throw new Error(
        isKorean
          ? t("admin.fileFormatError")
          : "Invalid file format. Please upload a JPG, JPEG, PNG, WebP, or HEIC image"
      )
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(isKorean ? t("admin.fileSizeError") : "File size too large. Maximum size is 5MB")
    }
  }

  const handleImageUpload = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      validateImage(newImage)
      setIsUploading(true)

      let imageToUpload = newImage
      if (newImage.type === "image/heic") {
        const convertedBlob = await heic2any({
          blob: newImage,
          toType: "image/jpeg",
          quality: 0.8,
        })
        imageToUpload = new File([convertedBlob], newImage.name.replace(/\.heic$/, ".jpg"), { type: "image/jpeg" })
      }

      const formData = new FormData()
      formData.append("image", imageToUpload)
      formData.append("alt", newImageAlt)

      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/gallery`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      console.log("Response status:", response.status)
      const contentType = response.headers.get("content-type")
      console.log("Content type:", contentType)

      if (!contentType?.includes("application/json")) {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        throw new Error(isKorean ? t("admin.error") : "Server returned non-JSON response")
      }

      const data = await response.json()

      if (response.ok) {
        setSuccess(isKorean ? t("admin.imageUploadSuccess") : "Image uploaded successfully")
        setNewImage(null)
        setNewImageAlt("")
        fetchImages()
      } else {
        setError(data.error || (isKorean ? t("admin.error") : "Failed to upload image"))
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError(error.message || (isKorean ? t("admin.error") : "Error uploading image"))
    } finally {
      setIsUploading(false)
    }
  }

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        validateImage(file)
        setNewImage(file)
        setError("")
      } catch (error) {
        setError(error.message)
        setNewImage(null)
        e.target.value = "" // Reset file input
      }
    }
  }

  const handleImageDelete = async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_URL}/api/gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        setSuccess(isKorean ? t("admin.imageDeleteSuccess") : "Image deleted successfully")
        fetchImages()
      } else {
        const errorData = await response.json()
        setError(errorData.error || (isKorean ? t("admin.error") : "Failed to delete image"))
      }
    } catch (error) {
      setError(isKorean ? t("admin.error") : "Error deleting image")
      console.error("Error deleting image:", error)
    }
  }

  return (
    <div className="mt-8 px-4 md:px-8">
      <h2 className="text-xl font-bold mb-4">{isKorean ? t("admin.manageGallery") : "Manage Gallery"}</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>
      )}

      <form onSubmit={handleImageUpload} className="mb-8">
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
            {isKorean
              ? t("admin.uploadImage") + " (JPG, JPEG, PNG, WebP, or HEIC, max 5MB)"
              : "Upload New Image (JPG, JPEG, PNG, WebP, or HEIC, max 5MB)"}
          </label>
          <input
            type="file"
            id="image"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/heic"
            onChange={handleImageSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="alt" className="block text-sm font-medium text-gray-700 mb-2">
            {isKorean ? t("admin.imageDescription") : "Image Description (Alt Text)"}
          </label>
          <input
            type="text"
            id="alt"
            value={newImageAlt}
            onChange={(e) => setNewImageAlt(e.target.value)}
            className="shadow-sm focus:ring-black focus:border-black block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder={isKorean ? t("admin.enterImageDescription") : "Enter a description for the image"}
          />
        </div>
        <button
          type="submit"
          disabled={isUploading || !newImage}
          className={`inline-flex items-center justify-center bg-black text-white px-4 py-2 rounded-md transition-colors duration-200 ${
            isUploading || !newImage ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
              {isKorean ? t("admin.uploadingImage") : "Uploading..."}
            </>
          ) : (
            isKorean ? t("admin.uploadImage") : "Upload Image"
          )}
        </button>
      </form>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.id} className="border rounded-lg shadow-sm overflow-hidden bg-white">
            <div className="aspect-w-4 aspect-h-3">
              <LazyImage src={image.url} alt={image.alt} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-500 mb-3 line-clamp-2" title={image.alt}>
                {image.alt}
              </p>
              <button
                onClick={() => handleImageDelete(image.id)}
                className="w-full bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
              >
                {isKorean ? t("admin.delete") : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GalleryManager
