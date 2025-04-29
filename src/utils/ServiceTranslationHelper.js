/**
 * This utility helps generate Korean translations for services
 * It can be used to identify missing translations
 */

import { servicesKo } from "../translations/services-ko"

export const findMissingTranslations = (services) => {
  const missingCategories = []
  const missingServices = []

  // Check for missing category translations
  Object.keys(services).forEach((category) => {
    if (!servicesKo.categories[category]) {
      missingCategories.push(category)
    }

    // Check for missing service translations
    services[category].forEach((service) => {
      if (!servicesKo.services[service.name]) {
        missingServices.push(service.name)
      }
    })
  })

  return {
    missingCategories,
    missingServices,
  }
}

export const generateTranslationTemplate = (services) => {
  const template = {
    categories: {},
    services: {},
  }

  // Generate template for categories
  Object.keys(services).forEach((category) => {
    template.categories[category] = servicesKo.categories[category] || ""
  })

  // Generate template for services
  Object.values(services)
    .flat()
    .forEach((service) => {
      template.services[service.name] = servicesKo.services[service.name] || ""
    })

  return template
}
