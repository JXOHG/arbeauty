"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { API_URL } from "../config"
import FullScreenImage from "./FullScreenImage"
import LazyImage from "./LazyImage"
import { useLanguage } from "../contexts/LanguageContext"

const Gallery = () => {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const { t } = useLanguage()

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/gallery`)
      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(`Failed to fetch images: ${response.status} ${response.statusText}`)
      }

      const data = JSON.parse(responseText)
      setImages(data)
    } catch (err) {
      setError(`Failed to load gallery images: ${err.message}`)
      console.error("Error fetching images:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageClick = (image) => {
    setSelectedImage(image)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <section id="gallery" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t("gallery.title")}</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="relative group overflow-hidden rounded-lg shadow-md">
              <LazyImage
                src={image.url}
                alt={image.alt}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110 cursor-pointer"
                onClick={() => handleImageClick(image)}
              />
            </div>
          ))}
        </div>
      </div>
      {selectedImage && <FullScreenImage image={selectedImage} onClose={() => setSelectedImage(null)} />}
    </section>
  )
}

export default Gallery
