"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const PlusIcon = ({ isOpen }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{
    transition: "transform 0.4s ease",
    transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
    flexShrink: 0,
  }}>
    <line x1="10" y1="2" x2="10" y2="18" stroke="currentColor" strokeWidth="1.5" />
    <line x1="2" y1="10" x2="18" y2="10" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

const Services = () => {
  const [openCategories, setOpenCategories] = useState({})
  const [services, setServices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { t, language, translateServiceCategory, translateServiceName } = useLanguage()
  const sectionRef = useRef(null)
  const parallaxBgRef = useRef(null)

  useEffect(() => {
    fetchServices()
  }, [])

  // Scroll-reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    )
    document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [services])

  // Parallax on section bg
  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxBgRef.current || !sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const progress = -rect.top / (rect.height + window.innerHeight)
      parallaxBgRef.current.style.transform = `translateY(${progress * 60}px)`
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/services`)
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      } else {
        setError("Failed to load services")
      }
    } catch (error) {
      setError("Error loading services")
    } finally {
      setLoading(false)
    }
  }

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  // Check if a category has any services with images
  const categoryHasImages = (servicesList) => {
    return servicesList.some(service => service.imageUrl)
  }

  return (
    <>
      <style>{`
        .services-section {
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }
        .services-texture {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 50%, rgba(201,169,110,0.04) 0%, transparent 60%),
            radial-gradient(circle at 80% 20%, rgba(201,169,110,0.03) 0%, transparent 50%);
          pointer-events: none;
        }
        .services-inner {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
          padding: 120px 40px;
        }
        .services-header {
          text-align: center;
          margin-bottom: 80px;
        }
        .services-eyebrow {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #c9a96e;
          display: block;
          margin-bottom: 16px;
        }
        .services-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 300;
          color: #fafaf8;
          line-height: 1.05;
        }
        .services-title em {
          font-style: italic;
          color: #c9a96e;
        }
        .services-gold-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
          justify-content: center;
        }
        .services-gold-line {
          height: 1px;
          width: 60px;
          background: linear-gradient(to right, transparent, #c9a96e);
        }
        .services-gold-line.right {
          background: linear-gradient(to left, transparent, #c9a96e);
        }
        .services-gold-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #c9a96e;
        }
        .category-block {
          border-top: 1px solid rgba(255,255,255,0.08);
          transition: border-color 0.3s ease;
        }
        .category-block:last-child { border-bottom: 1px solid rgba(255,255,255,0.08); }
        .category-btn {
          width: 100%;
          background: none;
          border: none;
          padding: 28px 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          gap: 16px;
          color: #fafaf8;
          transition: color 0.3s ease;
          text-align: left;
        }
        .category-btn:hover { color: #c9a96e; }
        .category-btn.open { color: #c9a96e; }
        .category-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.6rem;
          font-weight: 400;
          letter-spacing: 0.03em;
        }
        .category-count {
          font-family: 'Jost', sans-serif;
          font-size: 0.65rem;
          font-weight: 400;
          letter-spacing: 0.15em;
          color: rgba(201,169,110,0.6);
          margin-left: 8px;
          text-transform: uppercase;
        }
        .service-row {
          padding: 16px 0;
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .service-row:last-child { border-bottom: none; }
        .service-name {
          font-family: 'Jost', sans-serif;
          font-size: 0.875rem;
          font-weight: 300;
          letter-spacing: 0.05em;
          color: rgba(250,250,248,0.75);
        }
        .service-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: #c9a96e;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .service-dot-line {
          flex: 1;
          border-bottom: 1px dotted rgba(255,255,255,0.1);
          margin: 0 12px;
          min-width: 20px;
        }
        .services-content-inner {
          padding: 0 0 28px 0;
        }

        /* Service card with image styles */
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          padding: 0 0 28px 0;
        }
        .service-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .service-card:hover {
          border-color: rgba(201,169,110,0.3);
          transform: translateY(-2px);
        }
        .service-card-image {
          width: 100%;
          aspect-ratio: 4/3;
          object-fit: cover;
          display: block;
        }
        .service-card-content {
          padding: 16px;
        }
        .service-card-name {
          font-family: 'Jost', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          letter-spacing: 0.03em;
          color: rgba(250,250,248,0.9);
          margin-bottom: 8px;
        }
        .service-card-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 500;
          color: #c9a96e;
        }

        /* Mixed layout for categories with some images */
        .services-mixed-layout {
          padding: 0 0 28px 0;
        }
        .services-with-images {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }
        .services-text-only {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 16px;
        }

        @media (max-width: 600px) {
          .services-inner { padding: 80px 20px; }
          .category-name { font-size: 1.3rem; }
          .services-grid {
            grid-template-columns: 1fr;
          }
          .services-with-images {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section id="services" className="services-section" ref={sectionRef}>
        <div className="services-texture" ref={parallaxBgRef} />
        <div className="services-inner">
          <div className="services-header reveal">
            <span className="services-eyebrow">What We Offer</span>
            <h2 className="services-title">
              Our <em>Services</em>
            </h2>
            <div className="services-gold-divider">
              <div className="services-gold-line" />
              <div className="services-gold-dot" />
              <div className="services-gold-line right" />
            </div>
          </div>

          {loading && (
            <p style={{ textAlign: "center", color: "rgba(250,250,248,0.5)", fontFamily: "'Jost', sans-serif", letterSpacing: "0.1em" }}>
              {t("services.loading")}
            </p>
          )}
          {error && (
            <p style={{ textAlign: "center", color: "#c9a96e", fontFamily: "'Jost', sans-serif" }}>
              {t("services.error")}
            </p>
          )}

          {!loading && !error && (
            <div>
              {Object.entries(services).map(([type, servicesList], idx) => {
                const hasImages = categoryHasImages(servicesList)
                const servicesWithImages = servicesList.filter(s => s.imageUrl)
                const servicesWithoutImages = servicesList.filter(s => !s.imageUrl)

                return (
                  <div
                    key={type}
                    className="category-block reveal"
                    style={{ transitionDelay: `${idx * 0.08}s` }}
                  >
                    <button
                      className={`category-btn ${openCategories[type] ? "open" : ""}`}
                      onClick={() => toggleCategory(type)}
                      aria-expanded={openCategories[type]}
                    >
                      <span>
                        <span className="category-name">{translateServiceCategory(type)}</span>
                        <span className="category-count">({servicesList.length})</span>
                      </span>
                      <PlusIcon isOpen={openCategories[type]} />
                    </button>

                    <AnimatePresence initial={false}>
                      {openCategories[type] && (
                        <motion.div
                          key={`cat-${type}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                          style={{ overflow: "hidden" }}
                        >
                          {hasImages ? (
                            // Mixed layout: cards for services with images, text for others
                            <div className="services-mixed-layout">
                              {servicesWithImages.length > 0 && (
                                <div className="services-with-images">
                                  {servicesWithImages.map((service, index) => (
                                    <div key={`img-${index}`} className="service-card">
                                      <img
                                        src={service.imageUrl}
                                        alt={translateServiceName(service.name)}
                                        className="service-card-image"
                                      />
                                      <div className="service-card-content">
                                        <div className="service-card-name">
                                          {translateServiceName(service.name)}
                                        </div>
                                        <div className="service-card-price">{service.price}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {servicesWithoutImages.length > 0 && (
                                <div className="services-text-only">
                                  {servicesWithoutImages.map((service, index) => (
                                    <div key={`text-${index}`} className="service-row">
                                      <span className="service-name">{translateServiceName(service.name)}</span>
                                      <div className="service-dot-line" />
                                      <span className="service-price">{service.price}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            // Original text-only layout
                            <div className="services-content-inner">
                              {servicesList.map((service, index) => (
                                <div key={index} className="service-row">
                                  <span className="service-name">{translateServiceName(service.name)}</span>
                                  <div className="service-dot-line" />
                                  <span className="service-price">{service.price}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Services
