import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken');

      if (!token) {
        setMessage({ type: 'danger', text: 'No token found. Please log in.' });
        return;
      }

      try {
        const response = await axios.get('http://localhost:5001/login/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUserData(response.data);
        }
      } catch (error) {
        setMessage({ type: 'danger', text: 'Failed to load user data.' });
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '800px' }}>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-lg rounded-lg">
            <Card.Body className="p-4">
              <h1 className="text-center text-primary mb-4">Dashboard</h1>

              {message && <Alert variant={message.type}>{message.text}</Alert>}

              {userData ? (
                <>
                  <h3>Welcome, {userData.full_name}</h3>
                  <p>Email: {userData.email}</p>
                  <p>Role: {userData.role}</p>

                  {/* Example of role-based content */}
                  {userData.role === 'admin' && (
                    <Card className="mt-4">
                      <Card.Body>
                        <h5>Admin Panel</h5>
                        <p>Manage users, view statistics, and more.</p>
                      </Card.Body>
                    </Card>
                  )}

                  <Button variant="danger" onClick={handleLogout} className="mt-4">
                    <FaSignOutAlt className="mr-2" /> Logout
                  </Button>
                </>
              ) : (
                <div className="text-center">
                  <p>Loading user data...</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
