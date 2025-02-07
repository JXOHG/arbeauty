import React, { useState, useRef, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { FaInstagram } from 'react-icons/fa';
import { SiKakaotalk } from 'react-icons/si';
import qr from "../images/qr.jpg"

const isMobile = () => window.innerWidth <= 768;

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState('');
  const [isOnMobile, setIsOnMobile] = useState(isMobile());

  useEffect(() => {
    const handleResize = () => setIsOnMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setStatus('Sending...');

    // Create a template params object with all required fields
    const templateParams = {
      from_name: form.current.user_name.value,  // Add the name parameter
      user_name: form.current.user_name.value,  // Include both formats for flexibility
      user_email: form.current.user_email.value,
      message: form.current.message.value,
      reply_to: form.current.user_email.value,
      to_name: 'AR Beauty'  // Optional: Add recipient name
    };

    emailjs.send(
      'service_kpim5a5', 
      'template_10fxztq', 
      templateParams, 
      '9bd9kd2hoqTtulBVk'
    )
      .then((result) => {
        console.log(result.text);
        setStatus('Message sent successfully!');
        form.current.reset();
      }, (error) => {
        console.log(error.text);
        setStatus('Failed to send message. Please try again.');
      });
  };

  return (
    <section id="contact" className="py-16 md:py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Contact Us</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Get in Touch</h3>
            <p className="mb-4">We'd love to hear from you! Feel free to reach out through any of the following methods:</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> arbeauty2309@gmail.com</p>
              <p>
                <strong>Phone:</strong>{' '}
                {isOnMobile ? (
                  <a href="sms:+14373654320" className="text-blue-600 hover:underline">
                    (437) 365-4320
                  </a>
                ) : (
                  '(437) 365-4320'
                )}
              </p>
              <p><strong>KakaoTalk:</strong> arbeauty2309</p>
              <div className="flex items-center space-x-4 mt-4">
                <a href="https://www.instagram.com/arbeauty2309" target="_blank" rel="noopener noreferrer" className="text-2xl text-black hover:text-gray-700">
                  <FaInstagram />
                </a>
                <a href="http://qr.kakao.com/talk/4Rtne7MaI3qby8p5eprZNyvFJ5w-" target="_blank" rel="noopener noreferrer" className="text-2xl text-black hover:text-gray-700">
                  <SiKakaotalk />
                </a>
              </div>
            </div>
            <div className="mt-8">
              <h4 className="text-lg md:text-xl font-semibold mb-2">KakaoTalk QR Code</h4>
              <img src={qr} alt="KakaoTalk QR Code" className="w-32 h-32 md:w-40 md:h-40" />
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-xl md:text-2xl font-semibold mb-4">Send us a Message</h3>
            <form ref={form} onSubmit={sendEmail} className="space-y-4">
              <div>
                <label htmlFor="user_name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="user_name" id="user_name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label htmlFor="user_email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="user_email" id="user_email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea name="message" id="message" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black h-32"></textarea>
              </div>
              <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300">Send Message</button>
            </form>
            {status && <p className="mt-4 text-center font-medium">{status}</p>}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;