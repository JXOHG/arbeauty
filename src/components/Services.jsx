"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const ChevronDown = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
)

const Services = () => {
  const [openCategories, setOpenCategories] = useState({})
  const [services, setServices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { t, language, translateServiceCategory, translateServiceName } = useLanguage()

  useEffect(() => {
    fetchServices()
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
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  if (loading) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t("services.title")}</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-center">{t("services.loading")}</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t("services.title")}</h2>
          <div className="max-w-3xl mx-auto">
            <p className="text-center text-red-600">{t("services.error")}</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">{t("services.title")}</h2>
        <div className="max-w-3xl mx-auto">
          {Object.entries(services).map(([type, servicesList]) => (
            <div key={type} className="mb-6">
              <button
                className="w-full px-6 py-4 bg-black text-white hover:bg-gray-800 transition-colors duration-200 flex justify-between items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => toggleCategory(type)}
                aria-expanded={openCategories[type]}
                aria-controls={`category-${type}`}
              >
                <h3 className="text-xl font-semibold">{translateServiceCategory(type)}</h3>
                <motion.div animate={{ rotate: openCategories[type] ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  <ChevronDown />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openCategories[type] && (
                  <motion.div
                    key={`category-${type}`}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: "auto" },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div
                      id={`category-${type}`}
                      className="mt-2 bg-white border border-gray-200 rounded-lg shadow-inner"
                    >
                      {servicesList.map((service, index) => (
                        <div
                          key={index}
                          className={`flex justify-between items-center px-6 py-3 ${
                            index !== servicesList.length - 1 ? "border-b border-gray-200" : ""
                          }`}
                        >
                          <h4 className="text-lg font-medium">{translateServiceName(service.name)}</h4>
                          <p className="text-gray-600 font-semibold">{service.price}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
