/* eslint-disable no-unused-vars */
// src/components/Navbar/Navbar.jsx
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../../assets/logo.png';
import search_icon from '../../assets/search_icon.svg';
import bell_icon from '../../assets/bell_icon.svg';
import profile_img from '../../assets/profile_img.png';
import caret_icon from '../../assets/caret_icon.svg';
import { logout } from '../../firebase';

const Navbar = () => {
  const navRef = useRef();
  const mobileSidebarRef = useRef(); // new ref for the mobile sidebar
  const { t } = useTranslation();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 800);

  // Prevent body scrolling when the mobile sidebar is open
  useEffect(() => {
    if (showMobileSidebar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [showMobileSidebar]);

  // Add or remove nav-dark class on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 80) {
        navRef.current.classList.add('nav-dark');
      } else {
        navRef.current.classList.remove('nav-dark');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 800);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile sidebar when clicking outside (if needed)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showMobileSidebar &&
        mobileSidebarRef.current &&
        !mobileSidebarRef.current.contains(event.target)
      ) {
        setShowMobileSidebar(false);
      }
    };

    if (showMobileSidebar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileSidebar]);

  // Handle category click based on viewport size
  const handleCategoryClick = () => {
    if (isMobile) {
      setShowMobileSidebar((prev) => !prev);
    }
  };
  const genres = [
    { key: 'home', label: t('home', 'Home') },
    { key: 'tvShows', label: t('tvShows', 'TV Shows') },
    { key: 'movies', label: t('movies', 'Movies') },
    { key: 'newAndPopular', label: t('newAndPopular', 'New & Popular') },
    { key: 'myList', label: t('myList', 'My List') },
    { key: 'browseByLanguages', label: t('browseByLanguages', 'Browse by Languages') }
  ];
  

  return (
    <>
      <div ref={navRef} className="navbar">
        <div className="navbar-left">
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
          <Link to="/search">
            <img src={search_icon} alt="Search" className="icons" />
          </Link>

          {/* Category text that acts differently on mobile */}
          <div
            className="dropdown-container"
            onClick={handleCategoryClick}
            onMouseDown={(e) => e.preventDefault()}
          >
            <p className="dropdown-title">{t('category', 'Category')}</p>
          </div>

          <img src={bell_icon} alt="Notifications" className="icons" />

          <div className="navbar-profile">
            <img src={profile_img} alt="Profile" className="profile" />
            <img src={caret_icon} alt="Caret" />
            <div className="dropdown">
              <p onClick={() => logout()}>{t('signOut')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to disable background interactions */}
      {isMobile && showMobileSidebar && (
        <div
          className="overlay"
          onClick={() => setShowMobileSidebar(false)}
        ></div>
      )}

      {/* Mobile Sidebar for movie genres */}
      {isMobile && showMobileSidebar && (
        <div className="mobile-sidebar" ref={mobileSidebarRef}>
          <button
            className="close-sidebar"
            onClick={() => setShowMobileSidebar(false)}
          >
            &times;
          </button>
          <img src={logo} alt="Logo" className="mobile-logo" />
          <ul>
            {genres.map((genre) => (
              <li key={genre.key}>
                <Link
                  to={`/genre/${genre.key}`}
                  onClick={() => setShowMobileSidebar(false)}
                >
                  {genre.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default Navbar;
