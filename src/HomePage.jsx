// src/Home.jsx

import React from 'react';
import { useState } from 'react';

const HomePage = () => {
  const [alertStatus, setAlertStatus] = useState('');

  const handleAlertClick = (level) => {
    // Simulate emergency alert levels
    if (level === 1) {
      setAlertStatus('Emergency Alert: Low Severity');
    } else if (level === 2) {
      setAlertStatus('Emergency Alert: Moderate Severity');
    } else if (level === 3) {
      setAlertStatus('Emergency Alert: High Severity');
    }
  };

  return (
    <div className="container">
      <h1>Emergency Alert System</h1>
      <p>Welcome to the Emergency System. Tap to send an alert in case of emergency.</p>
      
      <div className="buttons">
        <button onClick={() => handleAlertClick(1)} className="alert-button">Tap for Low Severity</button>
        <button onClick={() => handleAlertClick(2)} className="alert-button">Tap for Moderate Severity</button>
        <button onClick={() => handleAlertClick(3)} className="alert-button">Tap for High Severity</button>
      </div>
      
      <div className="alert-status">
        {alertStatus && <p>{alertStatus}</p>}
      </div>
    </div>
  );
};

export default HomePage;
