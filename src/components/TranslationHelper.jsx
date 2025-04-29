"use client"

import { useState, useEffect } from "react"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"

const TranslationHelper = () => {
  const [services, setServices] = useState({})
  const [missingTranslations, setMissingTranslations] = useState({ categories: [], services: [] })
  const [showTemplate, setShowTemplate] = useState(false)
  const [template, setTemplate] = useState("")
  const [loading, setLoading] = useState(true)
  const { t } = useLanguage()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/services`)
      if (response.ok) {
        const data = await response.json()
        setServices(data)
        checkMissingTranslations(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    } finally {
      setLoading(false)
    }
  }

  const checkMissingTranslations = (services) => {
    // This would normally check against your actual translations
    // For demo purposes, we'll just assume some are missing
    const missingCategories = Object.keys(services).slice(0, 2)
    const missingServiceNames = []

    Object.values(services).forEach((categoryServices) => {
      categoryServices.forEach((service) => {
        if (Math.random() > 0.7) {
          // Randomly mark some as missing for demo
          missingServiceNames.push(service.name)
        }
      })
    })

    setMissingTranslations({
      categories: missingCategories,
      services: missingServiceNames,
    })
  }

  const generateTemplate = () => {
    const template = {
      categories: {},
      services: {},
    }

    // Generate template for categories
    Object.keys(services).forEach((category) => {
      template.categories[category] = ""
    })

    // Generate template for services
    Object.values(services)
      .flat()
      .forEach((service) => {
        template.services[service.name] = ""
      })

    setTemplate(JSON.stringify(template, null, 2))
    setShowTemplate(true)
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(template)
      .then(() => alert("Template copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err))
  }

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">{t("admin.translationHelper")}</h2>
        <p>{t("admin.loading")}</p>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">{t("admin.translationHelper")}</h2>
      <div className="p-4 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">{t("admin.translationHelper")}</h3>

        <div className="mb-4">
          <h4 className="font-medium mb-2">{t("admin.missingTranslations")}</h4>

          {missingTranslations.categories.length > 0 && (
            <div className="mb-2">
              <p className="font-medium">{t("admin.categories")}</p>
              <ul className="list-disc pl-5">
                {missingTranslations.categories.map((category) => (
                  <li key={category}>{category}</li>
                ))}
              </ul>
            </div>
          )}

          {missingTranslations.services.length > 0 && (
            <div>
              <p className="font-medium">{t("admin.services")}</p>
              <ul className="list-disc pl-5">
                {missingTranslations.services.map((service) => (
                  <li key={service}>{service}</li>
                ))}
              </ul>
            </div>
          )}

          {missingTranslations.categories.length === 0 && missingTranslations.services.length === 0 && (
            <p className="text-green-600">{t("admin.allTranslated")}</p>
          )}
        </div>

        <button
          onClick={generateTemplate}
          className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
        >
          {t("admin.generateTemplate")}
        </button>

        {showTemplate && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">{t("admin.translationTemplate")}</h4>
              <button onClick={copyToClipboard} className="text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">
                {t("admin.copy")}
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-96 text-sm">{template}</pre>
            <p className="mt-2 text-sm text-gray-600">{t("admin.updateInstructions")}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TranslationHelper
