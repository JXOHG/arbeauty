"use client"

import { useState, useEffect } from "react"
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import Hero from "./components/Hero.jsx"
import Services from "./components/Services.jsx"
import Staff from "./components/staff.jsx"
import LocationHours from "./components/LocationHours.jsx"
import Contact from "./components/Contact.jsx"
import Footer from "./components/footer.jsx"
import AnnouncementBanner from "./components/AnnouncementBanner.jsx"
import Login from "./components/Login.jsx"
import AnnouncementManager from "./components/AdminConsole.jsx"
import GalleryManager from "./components/GalleryManager.jsx"
import Gallery from "./components/Gallery"
import { LanguageProvider } from "./contexts/LanguageContext.jsx"

import "./components/styles/animations.css"
import { Helmet } from "react-helmet"

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
    } else {
      setTimeout(() => {
        const id = hash.replace("#", "")
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 0)
    }
  }, [pathname, hash])

  return null
}

function AppContent({ isLoggedIn, onLogout, onLogin }) {
  const location = useLocation()
  const isAdminPage = location.pathname === "/admin" || location.pathname === "/admin/gallery"
  
  return (
    <div style={{ fontFamily: "'Jost', sans-serif", background: "#fafaf8" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100 }}>
        <AnnouncementBanner />
        <Navbar isLoggedIn={isLoggedIn} onLogout={onLogout} isAdminPage={isAdminPage} />
      </div>

      {/* Hero starts right at the top (full-screen, no padding needed) */}
      <Routes>
        <Route
          path="/"
          element={
            <main>
              <Hero />
              <Services />
              <Staff />
              <LocationHours />
              <Contact />
            </main>
          }
        />
        <Route path="/gallery" element={<div style={{ paddingTop: "80px", background: "#0a0a0a" }}><Gallery /></div>} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/admin" /> : <Login onLogin={onLogin} />} />
        <Route path="/admin" element={isLoggedIn ? <AnnouncementManager /> : <Navigate to="/login" />} />
        <Route path="/admin/gallery" element={isLoggedIn ? <GalleryManager /> : <Navigate to="/login" />} />
      </Routes>

      <Footer />
    </div>
  )
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))

  const handleLogin = () => setIsLoggedIn(true)
  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
  }

  return (
    <LanguageProvider>
      <Helmet>
        <title>AR BEAUTY | Professional Beauty Services in Toronto</title>
        <meta
          name="description"
          content="AR BEAUTY offers professional beauty services including makeup, hair styling, and more. Book your appointment today for a luxurious beauty experience."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="beauty salon, makeup, hair styling, Canada beauty services" />
        <meta property="og:title" content="AR BEAUTY | Professional Beauty Services" />
        <meta property="og:description" content="Professional beauty services including makeup, hair styling, and more." />
        <meta property="og:url" content="https://arbeauty.ca" />
        <link rel="canonical" href="https://arbeauty.ca" />
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Jost:wght@200;300;400;500;600&display=swap" rel="stylesheet" />

        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              "name": "AR BEAUTY",
              "url": "https://arbeauty.ca",
              "description": "Professional beauty services including makeup, hair styling, and more",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Unit 103, 7191 Yonge St.",
                "addressLocality": "Toronto",
                "addressRegion": "ON",
                "postalCode": "L3T 0C4",
                "addressCountry": "CA"
              },
              "openingHours": ["Mo CLOSED", "Tu-We 10:30 AM - 7:30 PM","Th 02:30 PM - 7:30 PM", "Fr 10:30 AM - 7:30 PM", "Sa 10:30 AM - 6:30 PM","Su 10:30 AM - 6:30 PM"],
              "telephone": "4373654320",
              "priceRange": "$$",
              "image": "https://arbeauty.ca/logo.png",
              "sameAs": ["https://www.instagram.com/arbeauty2309"]
            }
          `}
        </script>
      </Helmet>

      <Router>
        <ScrollToTop />
        <AppContent isLoggedIn={isLoggedIn} onLogout={handleLogout} onLogin={handleLogin} />
      </Router>
    </LanguageProvider>
  )
}

export default App
