import React from 'react';

const Services = () => {
  const services = [
    { name: 'Men\'s Haircut', price: '$25' },
    { name: 'Women\'s Haircut', price: '$30 UP' },
    { name: 'Men\'s Perm', price: '$70' },
    { name: 'Women\'s Perm', price: '$80 UP' },
    { name: 'Highlights', price: '$130 UP' },
    { name: 'Magic Straightening', price: '$150 UP' },
  ];

  return (
    <section id="services" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Our Services</h2>
        <div className="max-w-3xl mx-auto">
          {services.map((service, index) => (
            <div 
              key={index} 
              className={`flex justify-between items-center py-4 ${
                index !== services.length - 1 ? 'border-b border-gray-200' : ''
              }`}
            >
              <h3 className="text-lg md:text-xl font-semibold">{service.name}</h3>
              <p className="text-gray-600 font-medium">{service.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

