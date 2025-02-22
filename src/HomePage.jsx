// src/HomePage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './css/HomePage.css';
import { FaShieldAlt, FaQrcode, FaUsers, FaPhoneAlt } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="home-container">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Emergency QR Code System</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
              </li>
              <li className="nav-item">
                <Link to="/adminregister" className="btn btn-outline-light me-2">Register</Link>
                <Link to="/login" className="btn btn-light">Login</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section text-center text-white">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1>Stay Safe with Emergency QR Codes</h1>
          <p>Alert emergency contacts instantly with just a scan. Quick, reliable, and life-saving.</p>
          <Link to="/adminregister" className="btn btn-lg btn-light mt-3">Get Started</Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section text-center py-5">
        <div className="container">
          <h2 className="mb-5">Why Choose Our System?</h2>
          <div className="row">
            <div className="col-md-4">
              <FaShieldAlt className="feature-icon" />
              <h3>Secure & Reliable</h3>
              <p>We ensure that your emergency data is secure and accessible when needed.</p>
            </div>
            <div className="col-md-4">
              <FaQrcode className="feature-icon" />
              <h3>Quick Alerts</h3>
              <p>Send alerts to emergency contacts with a simple QR code scan.</p>
            </div>
            <div className="col-md-4">
              <FaUsers className="feature-icon" />
              <h3>Easy to Use</h3>
              <p>Our system is designed for simplicity and efficiency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section text-center text-white py-5">
        <div className="container">
          <h2>Contact Us</h2>
          <p>Have questions? Reach out to our team for assistance.</p>
          <FaPhoneAlt className="contact-icon" />
          <p>Phone: +91 123 456 7890</p>
          <p>Email: support@example.com</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer text-center text-white py-3">
        <p>&copy; 2025 Emergency QR Code System. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
