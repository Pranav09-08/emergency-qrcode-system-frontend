// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './HomePage';

import './App.css';
import AlertPage from './AlertPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alert" element={<AlertPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
