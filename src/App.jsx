import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Staff from './components/staff.jsx';
import LocationHours from './components/LocationHours.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import AnnouncementBanner from './components/AnnouncementBanner.jsx';
import Login from './components/Login.jsx';
import AnnouncementManager from './components/AnnouncementManager.jsx';
import './components/styles/animations.css';
import { Helmet } from 'react-helmet';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <>
    <Helmet>
        {/* Default meta tags for your whole site */}
        <title>AR BEAUTY</title>
        <meta name="description" content="Default description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
    <Router>
      <ScrollToTop />
      <div className="font-sans bg-white text-black">
        <div className="fixed top-0 left-0 right-0 z-50">
          <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
          <AnnouncementBanner />
        </div>
        <div className="pt-28"> {/* Adjust this value based on the combined height of Navbar and AnnouncementBanner */}
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <Services />
                <Staff />
                <LocationHours />
                <Contact />
              </main>
            } />
            <Route path="/login" element={
              isLoggedIn ? <Navigate to="/admin" /> : <Login onLogin={handleLogin} />
            } />
            <Route path="/admin" element={
              isLoggedIn ? <AnnouncementManager /> : <Navigate to="/login" />
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
    </>
  );
}

export default App;

