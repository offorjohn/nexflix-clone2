/* eslint-disable no-unused-vars */
// src/components/Navbar/Navbar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Import the translation hook
import './Navbar.css';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search_icon.svg';
import bell_icon from '../../assets/bell_icon.svg';
import { Link } from 'react-router-dom';
import profile_img from '../../assets/profile_img.png';
import caret_icon from '../../assets/caret_icon.svg';
import { logout } from '../../firebase';

const Navbar = () => {
  const navRef = useRef();
  const { t, i18n } = useTranslation(); // Get t function and i18n instance
  const [showChildrenDropdown, setShowChildrenDropdown] = useState(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark');
      } else {
        navRef.current.classList.remove('nav-dark');
      }
    });
  }, []);

  const toggleChildrenDropdown = () => {
    setShowChildrenDropdown((prevState) => !prevState);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">
        {/* Wrap the logo in a Link to redirect to the homepage */}
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <ul>
          <li>{t('home')}</li>
          <li>{t('tvShows')}</li>
          <li>{t('movies')}</li>
          <li>{t('newAndPopular')}</li>
          <li>{t('myList')}</li>
          <li>{t('browseByLanguages')}</li>
        </ul>
      </div>

      <div className="navbar-right">
        <Link to={"/search"}>
          <img src={search_icon} alt="Search" className='icons' />
        </Link>

        {/* Dropdown for Categories */}
        <div 
          className="dropdown-container"
          onClick={toggleChildrenDropdown} 
          onMouseDown={(e) => e.preventDefault()}  // Prevent default focus outline
        >
          <p className="dropdown-title">{t('children')}</p>
          {showChildrenDropdown && (
            <div className="dropdown-menu">
              <Link to="/kids" className="dropdown-item">{t('kids')}</Link>
              <Link to="/family" className="dropdown-item">{t('family')}</Link>
              <Link to="/education" className="dropdown-item">{t('educational')}</Link>
            </div>
          )}
        </div>

        <img src={bell_icon} alt="" className='icons' />

        <div className="navbar-profile">
          <img src={profile_img} alt="" className='profile' />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p onClick={() => logout()}>{t('signOut')}</p>
          </div>
        </div>

        {/* Language Selector */}
        <select onChange={(e) => changeLanguage(e.target.value)} className="lang-selector">
          <option value="en">English</option>
          <option value="ar">العربية</option>
        </select>
      </div>
    </div>
  );
};

export default Navbar;
