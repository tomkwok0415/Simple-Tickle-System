import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Preferences from './components/Preference';
import IssuePage from './components/IssuePage';
import Login from './components/Login';

function App() {
  /** 
  const navigate = useNavigate();
  if (window.localStorage.getItem("token")) {
    if (window.localStorage.getItem("admin") == "true") {
      navigate("/Preference");
    } else {
      navigate("/Dashboard");
    }
  } else {
    navigate("/");
  }
  */
  return (
    <div className="wrapper">
      <div className="App">
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/Dashboard" element={<Dashboard />}>
              </Route>
              <Route path="/Dashboard/IssuePage" element={<IssuePage />}>
              </Route>    
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;