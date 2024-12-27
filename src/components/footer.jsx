import React from 'react';
import { FaInstagram } from 'react-icons/fa';
import { SiKakaotalk } from 'react-icons/si';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <p>&copy; 2024 AR Beauty Hair Salon. All rights reserved.</p>
          </div>
          <div className="flex space-x-4">
            <a href="https://www.instagram.com/arbeauty2309" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-300">
              <FaInstagram />
            </a>
            <a href="http://qr.kakao.com/talk/4Rtne7MaI3qby8p5eprZNyvFJ5w-" target="_blank" rel="noopener noreferrer" className="text-2xl hover:text-gray-300">
              <SiKakaotalk />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

