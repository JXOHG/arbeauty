import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';
import logo from "../images/logo.png";

const Navbar = ({ isLoggedIn, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const NavItem = ({ to, children }) => {
    if (location.pathname === '/' && to !== 'gallery') {
      return (
        <ScrollLink
          to={to}
          smooth={true}
          duration={500}
          className="block cursor-pointer hover:text-gray-300 px-4 md:px-0"
          onClick={closeMenu}
        >
          {children}
        </ScrollLink>
      );
    } else {
      return (
        <Link
          to={to === 'gallery' ? '/gallery' : `/#${to}`}
          className="block cursor-pointer hover:text-gray-300 px-4 md:px-0"
          onClick={closeMenu}
        >
          {children}
        </Link>
      );
    }
  };

  return (
    <nav className="bg-black text-white w-full">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center cursor-pointer">
            <img
              src={logo}
              alt="AR Beauty Hair Logo"
              className="w-10 h-10 mr-2"
            />
            <span className="text-2xl font-bold">AR Beauty</span>
          </Link>
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <ul className={`md:flex md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} absolute md:relative top-full left-0 w-full md:w-auto bg-black md:bg-transparent`}>
            {['home', 'services', 'staff',  'location', 'contact', 'gallery'].map((item) => (
              <li key={item} className="py-2 md:py-0">
                <NavItem to={item}>
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </NavItem>
              </li>
            ))}
            {isLoggedIn ? (
              <>
                <li className="py-2 md:py-0">
                  <Link to="/admin" className="block cursor-pointer hover:text-gray-300 px-4 md:px-0" onClick={closeMenu}>
                    Admin
                  </Link>
                </li>
                <li className="py-2 md:py-0">
                  <button onClick={() => { onLogout(); closeMenu(); }} className="block cursor-pointer hover:text-gray-300 px-4 md:px-0">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="py-2 md:py-0">
                <Link to="/login" className="block cursor-pointer hover:text-gray-300 px-4 md:px-0" onClick={closeMenu}>
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

