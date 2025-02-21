import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaUserShield, FaLock } from 'react-icons/fa';

const AdminRegistrationForm = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'HR', // Default role is 'HR'
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'danger', text: 'Passwords do not match' });
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Admin registered successfully!' });
        setFormData({
          full_name: '',
          email: '',
          phone: '',
          role: 'HR',
          password: '',
          confirmPassword: '',
        });
      } else {
        setMessage({ type: 'danger', text: 'Error registering admin' });
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'danger', text: 'An error occurred while registering the admin.' });
    }
  };

  return (
    <Container className="mt-5" style={{ maxWidth: '600px' }}>
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="shadow-lg rounded-lg">
            <Card.Body className="p-4">
              <h1 className="text-center text-primary mb-4">Admin Registration</h1>

              {message && <Alert variant={message.type}>{message.text}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="full_name">
                  <Form.Label><FaUser className="mr-2" /> Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="mb-3 p-3"
                    style={{
                      borderRadius: '12px',
                      borderColor: '#007bff',
                      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.1)',
                      backgroundColor: '#f8f9fa',
                    }}
                  />
                </Form.Group>
                
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
                    style={{
                      borderRadius: '12px',
                      borderColor: '#007bff',
                      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.1)',
                      backgroundColor: '#f8f9fa',
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="phone">
                  <Form.Label><FaPhone className="mr-2" /> Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter phone number"
                    className="mb-3 p-3"
                    style={{
                      borderRadius: '12px',
                      borderColor: '#007bff',
                      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.1)',
                      backgroundColor: '#f8f9fa',
                    }}
                  />
                </Form.Group>

                <Form.Group controlId="role">
                  <Form.Label><FaUserShield className="mr-2" /> Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="mb-3 p-3"
                    style={{
                      borderRadius: '12px',
                      borderColor: '#007bff',
                      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.1)',
                      backgroundColor: '#f8f9fa',
                    }}
                  >
                    <option value="HR">HR</option>
                    <option value="Security">Security</option>
                    <option value="Medical">Medical</option>
                  </Form.Control>
                </Form.Group>

                {/* Password Field */}
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
                    style={{
                      borderRadius: '12px',
                      borderColor: '#007bff',
                      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.1)',
                      backgroundColor: '#f8f9fa',
                    }}
                  />
                </Form.Group>

                {/* Confirm Password Field */}
                <Form.Group controlId="confirmPassword">
                  <Form.Label><FaLock className="mr-2" /> Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Confirm password"
                    className="mb-3 p-3"
                    style={{
                      borderRadius: '12px',
                      borderColor: '#007bff',
                      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.1)',
                      backgroundColor: '#f8f9fa',
                    }}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  block
                  className="mt-3 py-2"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#007bff',
                    boxShadow: '0 4px 8px rgba(0, 123, 255, 0.2)',
                  }}
                >
                  Register Admin
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminRegistrationForm;
