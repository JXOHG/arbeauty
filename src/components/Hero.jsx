"use client"
import styles from "./styles/hero.module.css"
import { useLanguage } from "../contexts/LanguageContext"

const Hero = () => {
  const { t } = useLanguage()

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="w-full h-full">
          <img src="/black-poster.jpg" alt="AR Beauty Hair Salon" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${styles.shadowText}`}>{t("hero.welcome")}</h1>
        <p className={`text-lg md:text-xl ${styles.shadowText}`}>{t("hero.experience")}</p>
      </div>
    </section>
  )
}

export default Hero
