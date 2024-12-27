import React from 'react';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Services from './components/Services.jsx';
import Staff from './components/Staff.jsx';
import LocationHours from './components/LocationHours.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <div className="font-sans bg-white text-black">
      <Navbar />
      <main className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        <Hero />
        <Services />
        <Staff />
        <LocationHours />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;

