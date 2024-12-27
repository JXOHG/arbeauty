import React from 'react';

const LocationHours = () => {
  const hours = [
    { day: 'Monday', time: 'CLOSED' },
    { day: 'Tuesday', time: '10:00 AM - 7:30 PM' },
    { day: 'Wednesday', time: '10:00 AM - 7:30 PM' },
    { day: 'Thursday', time: '02:00 PM - 7:30 PM' },
    { day: 'Friday', time: '10:00 PM - 7:30 PM' },
    { day: 'Saturday', time: '09:30 AM - 5:30 PM' },
    { day: 'Sunday', time: '09:30 AM - 5:30 PM' },
  ];

  const mapUrl = "https://maps.app.goo.gl/TtBD6ZsdoMM7RCEa8"
  return (
    <section id="location" className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Location & Hours</h2>
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0 md:w-1/2">
            <h3 className="text-xl font-semibold mb-4">Our Location</h3>
            <p>Unit 103, 7191 Yonge St.</p>
            <p>Thornhill, ON L3T 0C4</p>
            <p>Phone: (437) 365-4320</p>
            <a 
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition duration-300"
            >
              View on Google Maps
            </a>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-xl font-semibold mb-4">Store Hours</h3>
            <ul className="space-y-2">
              {hours.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span className="font-medium">{item.day}:</span>
                  <span>{item.time}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-8">
          <iframe
        
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2879.5301160143495!2d-79.4206894!3d43.8033624!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882b2d7ede834fdf%3A0x62d8a63fd240f8ff!2zQVIgQkVBVVRZIEhBSVIgU0FMT04g66-47Jqp7Iuk!5e0!3m2!1sen!2sca!4v1735239049810!5m2!1sen!2sca"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            title="AR Beauty Hair Salon Location"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default LocationHours;

