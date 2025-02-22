import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, ListGroup } from 'react-bootstrap';
import { FaSignOutAlt, FaBell, FaUserPlus, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';
import './css/Dashboard.css';
import { useNavigate } from 'react-router-dom';
import IncidentReportsCard from './IncidentLogs';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [incidentReports, setIncidentReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setMessage({ type: 'danger', text: 'No token found. Please log in.' });
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://emergency-qrcode-system-backend.onrender.com/login/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUserData(response.data);
          setNotifications(response.data.notifications || []);
          setIncidentReports(response.data.incidentReports || []);
        }
      } catch (error) {
        setMessage({ type: 'danger', text: 'Failed to load user data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('authToken');
      window.location.href = '/';
    }
  };

  return (
    <Container fluid className="dashboard-container">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="main-card shadow-sm rounded-lg">
            <Card.Body>
              <h1 className="text-center text-primary mb-4">Dashboard</h1>

              {message && <Alert variant={message.type}>{message.text}</Alert>}

              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p>Loading user data...</p>
                </div>
              ) : userData ? (
                <>
                  <h3 className="text-dark">Welcome, {userData.full_name}</h3>
                  <p>Email: <strong>{userData.email}</strong></p>
                  <p>Role: <strong>{userData.role}</strong></p>

                  <div className="button-group mt-4">

                    <Button
                      variant="success"
                      className="d-flex align-items-center"
                      onClick={() => navigate('/register')}  // Navigate to /register
                    >
                      <FaUserPlus className="me-2" />
                      Employee Registration
                    </Button>
                  </div>

                 <IncidentReportsCard/>

                  <div className="mt-4">
                    <Button
                      variant="danger"
                      onClick={handleLogout}
                      className="d-flex align-items-center"
                    >
                      <FaSignOutAlt className="me-2" /> Logout
                    </Button>
                  </div>
                </>
              ) : (
                <Alert variant="warning">No user data found.</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
