"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { enUS } from "../translations/en-US"
import { koKR } from "../translations/ko-KR"
import { servicesKo } from "../translations/services-ko"

const translations = {
  "en-US": enUS,
  "ko-KR": koKR,
}

const LanguageContext = createContext()

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en-US")

  useEffect(() => {
    // Detect browser language
    const detectLanguage = () => {
      const browserLang = navigator.language
      // Check if the language is Korean
      if (browserLang.startsWith("ko")) {
        setLanguage("ko-KR")
      } else {
        setLanguage("en-US")
      }
    }

    detectLanguage()
  }, [])

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en-US" ? "ko-KR" : "en-US"))
  }

  const t = (key) => {
    const keys = key.split(".")
    let result = translations[language]

    for (const k of keys) {
      if (result && result[k]) {
        result = result[k]
      } else {
        // Fallback to English if translation is missing
        let fallback = translations["en-US"]
        for (const fk of keys) {
          if (fallback && fallback[fk]) {
            fallback = fallback[fk]
          } else {
            return key // Return the key if no translation found
          }
        }
        return fallback
      }
    }

    return result
  }

  // Function to translate service category
  const translateServiceCategory = (category) => {
    if (language === "en-US") return category
    return servicesKo.categories[category] || category
  }

  // Function to translate service name
  const translateServiceName = (name) => {
    if (language === "en-US") return name
    return servicesKo.services[name] || name
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        t,
        translateServiceCategory,
        translateServiceName,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
