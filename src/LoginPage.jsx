import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import axios from 'axios'; // Import Axios
import { useNavigate } from 'react-router-dom'; // React Router v6 for navigation

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState(null);
  const navigate = useNavigate(); // React Router v6 for navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use axios to make the POST request
      const response = await axios.post('https://emergency-qrcode-system-backend.onrender.com/login/login', formData);

      if (response.status === 200) {
        const { token, user } = response.data;

        // Store the token in localStorage
        localStorage.setItem('authToken', token);

        // Set success message
        setMessage({ type: 'success', text: 'Login successful!' });

        // Redirect to the dashboard page
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage({ type: 'danger', text: 'An error occurred during login.' });
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-lg rounded-lg">
            <Card.Body className="p-4">
              <h1 className="text-center text-primary mb-4">Login</h1>

              {message && <Alert variant={message.type}>{message.text}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="email">
                  <Form.Label><FaEnvelope className="mr-2" /> Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter email"
                    className="mb-3 p-3"
                  />
                </Form.Group>

                <Form.Group controlId="password">
                  <Form.Label><FaLock className="mr-2" /> Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                    className="mb-3 p-3"
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  block
                  className="mt-3 py-2"
                >
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
