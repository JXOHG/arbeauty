import React from 'react';
import styles from './styles/hero.module.css';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/black-poster.jpg"
          className="w-full h-full object-cover"
        >
          <source src="/haircut-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${styles.shadowText}`}>
          Welcome to AR Beauty Hair Salon
        </h1>
        <p className={`text-lg md:text-xl ${styles.shadowText}`}>
          Experience the Augmented Reality beauty and style
        </p>
      </div>
    </section>
  );
};

export default Hero;

