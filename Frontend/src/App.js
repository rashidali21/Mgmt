import React, { } from 'react';
import './App.css';
  
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
  
import Home from "./pages/Home";
import Login from './pages/Login'
import Register from './pages/Register'
import Song from './pages/Song';
 
function App() {
  return (
    <div className="vh-100 gradient-custom">
    <div className="">   
      <BrowserRouter>
        <Routes>
            <Route path="/" element={ <Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/song" element={<Song />} />
        </Routes>
      </BrowserRouter>
    </div>
    </div>
  );
}
   
export default App;