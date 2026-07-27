"use client"

import { useState, useEffect, useRef } from "react"
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
  const [hoveredId, setHoveredId] = useState(null)
  const { t } = useLanguage()
  const parallaxRef = useRef(null)

  useEffect(() => {
    fetchImages()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08, rootMargin: "0px 0px -60px 0px" }
    )
    document.querySelectorAll(".gallery-item").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [images])

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return
      const scrollY = window.scrollY
      parallaxRef.current.style.transform = `translateY(${scrollY * 0.25}px)`
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/gallery`)
      const responseText = await response.text()
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`)
      const data = JSON.parse(responseText)
      setImages(data)
    } catch (err) {
      setError(`Failed to load gallery: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "16px"
      }}>
        <Loader2 style={{ color: "#c9a96e", width: "32px", height: "32px", animation: "spin 1s linear infinite" }} />
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(201,169,110,0.5)" }}>
          Loading Gallery
        </p>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        .gallery-page {
          background: #0a0a0a;
          min-height: 100vh;
        }
        .gallery-hero {
          position: relative;
          height: 40vh;
          min-height: 280px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
          background: #111;
        }
        .gallery-hero-bg {
          position: absolute;
          inset: -20%;
          background: linear-gradient(
            135deg,
            rgba(201,169,110,0.06) 0%,
            transparent 60%
          );
          will-change: transform;
        }
        .gallery-hero-pattern {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(201,169,110,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,110,0.05) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .gallery-hero-content {
          position: relative;
          z-index: 2;
          padding: 60px 60px;
          width: 100%;
        }
        .gallery-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a96e;
          display: block;
          margin-bottom: 12px;
        }
        .gallery-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(3rem, 8vw, 6rem);
          font-weight: 300;
          color: #fafaf8;
          line-height: 0.95;
        }
        .gallery-title em { font-style: italic; color: #c9a96e; }
        .gallery-count {
          font-family: 'Jost', sans-serif;
          font-size: 0.7rem;
          font-weight: 400;
          letter-spacing: 0.2em;
          color: rgba(250,250,248,0.3);
          text-transform: uppercase;
          margin-top: 16px;
        }
        .gallery-body {
          padding: 60px;
        }
        .gallery-masonry {
          columns: 3;
          column-gap: 16px;
        }
        .gallery-item {
          break-inside: avoid;
          margin-bottom: 16px;
          position: relative;
          overflow: hidden;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
          cursor: pointer;
        }
        .gallery-item.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .gallery-item-img {
          width: 100%;
          display: block;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .gallery-item:hover .gallery-item-img {
          transform: scale(1.05);
        }
        .gallery-item-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10,10,10,0);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.4s ease;
        }
        .gallery-item:hover .gallery-item-overlay {
          background: rgba(10,10,10,0.4);
        }
        .gallery-item-icon {
          width: 40px;
          height: 40px;
          border: 1px solid rgba(201,169,110,0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c9a96e;
          opacity: 0;
          transform: scale(0.7);
          transition: all 0.4s ease;
        }
        .gallery-item:hover .gallery-item-icon {
          opacity: 1;
          transform: scale(1);
        }
        .gallery-error {
          margin: 20px 60px;
          padding: 16px 20px;
          border: 1px solid rgba(200,60,60,0.3);
          background: rgba(200,60,60,0.08);
          color: #e88080;
          font-family: 'Jost', sans-serif;
          font-size: 0.8rem;
        }
        @media (max-width: 900px) {
          .gallery-masonry { columns: 2; }
          .gallery-hero-content { padding: 40px 24px; }
          .gallery-body { padding: 32px 20px; }
        }
        @media (max-width: 500px) {
          .gallery-masonry { columns: 1; }
        }
      `}</style>

      <div className="gallery-page" id="gallery">
        <div className="gallery-hero">
          <div className="gallery-hero-bg" ref={parallaxRef} />
          <div className="gallery-hero-pattern" />
          <div className="gallery-hero-content">
            <span className="gallery-eyebrow">AR Beauty</span>
            <h1 className="gallery-title">
              Our <em>Work</em>
            </h1>
            {images.length > 0 && (
              <p className="gallery-count">{images.length} photos</p>
            )}
          </div>
        </div>

        {error && (
          <div className="gallery-error">{error}</div>
        )}

        <div className="gallery-body">
          <div className="gallery-masonry">
            {images.map((image, idx) => (
              <div
                key={image.id}
                className="gallery-item"
                style={{ transitionDelay: `${(idx % 9) * 0.06}s` }}
                onClick={() => setSelectedImage(image)}
              >
                <LazyImage
                  src={image.url}
                  alt={image.alt}
                  className="gallery-item-img"
                />
                <div className="gallery-item-overlay">
                  <div className="gallery-item-icon">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedImage && (
        <FullScreenImage image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </>
  )
}

export default Gallery