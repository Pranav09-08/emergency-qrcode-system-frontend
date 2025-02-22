import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner, Badge, ListGroup } from 'react-bootstrap';
import { FaSignOutAlt, FaBell, FaUserPlus, FaExclamationCircle } from 'react-icons/fa';
import axios from 'axios';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [incidentReports, setIncidentReports] = useState([]);

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
    <Container fluid className="d-flex flex-column vh-100 p-4">
      <Row className="flex-grow-1">
        <Col>
          <Card className="h-100 border-0 shadow-sm rounded-lg">
            <Card.Body className="d-flex flex-column p-4">
              <h1 className="text-center text-primary mb-4">Dashboard</h1>

              {message && <Alert variant={message.type}>{message.text}</Alert>}

              {loading ? (
                <div className="text-center flex-grow-1 d-flex flex-column justify-content-center">
                  <Spinner animation="border" variant="primary" />
                  <p>Loading user data...</p>
                </div>
              ) : userData ? (
                <>
                  <h3>Welcome, {userData.full_name}</h3>
                  <p>Email: <strong>{userData.email}</strong></p>
                  <p>Role: <strong>{userData.role}</strong></p>

                  <div className="mt-3 mb-3 d-flex justify-content-between">
                    <Button variant="info" className="d-flex align-items-center">
                      <FaBell className="me-2" />
                      Notifications <Badge bg="danger" className="ms-2">{notifications.length}</Badge>
                    </Button>

                    {userData.role === 'admin' && (
                      <Button variant="success" className="d-flex align-items-center">
                        <FaUserPlus className="me-2" />
                        Employee Registration
                      </Button>
                    )}
                  </div>

                  <Card className="mt-4 border-0 shadow-sm rounded-lg">
                    <Card.Body>
                      <h5 className="text-secondary">
                        <FaExclamationCircle className="me-2" />
                        Incident Reports
                      </h5>
                      {incidentReports.length > 0 ? (
                        <ListGroup variant="flush">
                          {incidentReports.map((report, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                              <span>{report.title}</span>
                              <Badge bg={report.status === 'Pending' ? 'warning' : 'success'}>
                                {report.status}
                              </Badge>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      ) : (
                        <Alert variant="info">No incident reports found.</Alert>
                      )}
                    </Card.Body>
                  </Card>

                  <div className="mt-auto">
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
