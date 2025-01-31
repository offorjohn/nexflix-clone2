/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import Home from './pages/Home/Home';
import SearchPage from './pages/Search/SearchPage';
import Login from './pages/Login/Login';
import netflix_spinner from './assets/netflix_spinner.gif';

import Player from './pages/Player/Player';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const auth = getAuth();

const App = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            console.log("User is logged in");
            setUser(user);
            // Navigate only if the user was previously logged out
            if (window.location.pathname === '/login') {
              navigate('/');
            }
          } else {
            console.log("User is logged out");
            navigate('/login');
          }
          setLoading(false);
        });

        return () => unsubscribe(); // Cleanup listener
      })
      .catch((error) => {
        console.error("Error setting persistence:", error);
        setLoading(false);
      });
  }, [navigate]);

 
  // ✅ FIXED: Ensure loading screen is correctly returned
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#000' // Netflix-style dark background
      }}>
        <img src={netflix_spinner} alt="Loading..." style={{ width: '100px', height: '100px' }} />
      </div>
    );
  }
  return (
   
    <div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/player/:id" element={<Player />} />
        <Route path="/search" element={<SearchPage />} />
      </Routes>
    </div>
  );
};

export default App;
