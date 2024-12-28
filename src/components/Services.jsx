import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChevronUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);

const Services = () => {
  const [openCategories, setOpenCategories] = useState({});

  const servicesByType = {
    'Haircut': [
      { name: 'Men\'s Haircut', price: '$25 UP' },
      { name: 'Fade cut', price: '$30' },
      { name: 'Long cut', price: '$30 UP' },
      { name: 'Women\'s Haircut', price: '$30 UP' },
      { name: 'Women\'s Bang', price: '$7' },
    ],
    'Perm & Straightening': [
      { name: 'Men\'s Perm', price: '$75' },
      { name: 'Women\'s Perm', price: '$80 UP' },
      { name: 'Men\'s Hippie Perm', price: '$95' },
      { name: 'Women\'s Hippie Perm', price: '$100 UP' },
      { name: 'Iron Perm', price: '$200 UP' },
      { name: 'Spiral Perm', price: '$200 UP' },
      { name: 'Keratin Magic Straightening', price: '$200 UP' },
      { name: 'Men\'s Down Perm', price: '$60 (full $80)' },
      { name: 'Digital Perm', price: '$160 UP' },
      { name: 'Magic Setting Perm', price: '$180 UP' },
      { name: 'Magic Straightening', price: '$150 UP' },
    ],
    'Colour': [
      { name: 'Highlights (full)', price: '$130 UP' },
      { name: 'Highlights (partial)', price: '$80 UP' },
      { name: 'Men\'s Root Colour', price: '$55' },
      { name: 'Women\'s Root Colour', price: '$65' },
      { name: 'Men\'s Full Colour', price: '$80' },
      { name: 'Women\'s Full Colour', price: '$100 UP' },
      { name: 'Balayage & Ombre', price: '$200 UP' },
      { name: 'Secret two-tone', price: '$150 UP' },
    ],
    'Hair Services': [
      { name: 'Hair Treatment', price: '$50' },
      { name: 'Scalp Treatment', price: '$40' },
    ],
  };

  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <section id="services" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Services</h2>
        <div className="max-w-3xl mx-auto">
          {Object.entries(servicesByType).map(([type, services]) => (
            <div key={type} className="mb-6">
              <button
                className="w-full px-6 py-4 bg-black text-white hover:bg-gray-800 transition-colors duration-200 flex justify-between items-center rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                onClick={() => toggleCategory(type)}
                aria-expanded={openCategories[type]}
                aria-controls={`category-${type}`}
              >
                <h3 className="text-xl font-semibold">{type}</h3>
                <motion.div
                  animate={{ rotate: openCategories[type] ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
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
                      open: { opacity: 1, height: 'auto' },
                      collapsed: { opacity: 0, height: 0 }
                    }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div 
                      id={`category-${type}`}
                      className="mt-2 bg-white border border-gray-200 rounded-lg shadow-inner"
                    >
                      {services.map((service, index) => (
                        <div 
                          key={index} 
                          className={`flex justify-between items-center px-6 py-3 ${
                            index !== services.length - 1 ? 'border-b border-gray-200' : ''
                          }`}
                        >
                          <h4 className="text-lg font-medium">{service.name}</h4>
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
  );
};

export default Services;

