// src/AlertPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Fetchuser from './Fetchuser'

const AlertPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Emergency Alert Sent</h1>
      <p>Your alert has been sent successfully. Responders will be notified.</p>
      <button onClick={() => navigate('/')}>Go Back to Home</button>
      <Fetchuser/>
    </div>
  );
};

export default AlertPage;
