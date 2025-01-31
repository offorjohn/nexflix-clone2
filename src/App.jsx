/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import Home from './pages/Home/Home'
import { Routes, Route, useNavigate } from 'react-router-dom'
import SearchPage from './pages/Search/SearchPage'
import Login from './pages/Login/Login'
import Player from './pages/Player/Player'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {

  const navigate = useNavigate();

  useEffect(()=>{
    
    onAuthStateChanged(auth, async (user)=>{
      if(user){
        console.log("Logged In");
        navigate('/');
      }else{
        console.log("Logged Out");
        navigate('/login');
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <div>
      <ToastContainer theme='dark'/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/player/:id' element={<Player/>}/>
        
        <Route path='/search' element={<SearchPage/>}/>
      </Routes>
      
    </div>
  )
}

export default App
