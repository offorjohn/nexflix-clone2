/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
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

  return (
    <div ref={navRef} className='navbar'>
      <div className="navbar-left">
        {/* Wrap the logo in a Link to redirect to the homepage */}
        <Link to="/">
          <img src={logo} alt="Logo" />
        </Link>
        <ul>
          <li>Home</li>
          <li>TV Shows</li>
          <li>Movies</li>
          <li>New & Popular</li>
          <li>My List</li>
          <li>Browse by Languages</li>
        </ul>
      </div>

      <div className="navbar-right">
        <Link to={"/search"}>
          <img src={search_icon} alt="Search" className='icons' />
        </Link>

        {/* Children Dropdown */}
        <div 
          className="dropdown-container" 
          onMouseEnter={() => setShowChildrenDropdown(true)} 
          onMouseLeave={() => setShowChildrenDropdown(false)}
          onMouseDown={(e) => e.preventDefault()} // Prevent default focus
        >
          <p className="dropdown-title">Children</p>
          {showChildrenDropdown && (
            <div className="dropdown-menu">
              <Link to="/kids" className="dropdown-item">Kids</Link>
              <Link to="/family" className="dropdown-item">Family</Link>
              <Link to="/education" className="dropdown-item">Educational</Link>
            </div>
          )}
        </div>

        <img src={bell_icon} alt="" className='icons' />

        <div className="navbar-profile">
          <img src={profile_img} alt="" className='profile' />
          <img src={caret_icon} alt="" />
          <div className="dropdown">
            <p onClick={() => logout()}>تسجيل الخروج</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
