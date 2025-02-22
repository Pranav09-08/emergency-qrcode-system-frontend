import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './HomePage';
import AlertPage from './AlertPage';
import AdminRegistrationForm from './AdminRegister';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import EmployeeRegistration from './EmployeeRegistration';
import EmployeeDetails from './EmployeeDetails';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alert" element={<AlertPage />} />
          <Route path="/adminregister" element={<AdminRegistrationForm />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/register" element={<EmployeeRegistration />} />
          <Route path="/employee" element={<EmployeeDetails />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
