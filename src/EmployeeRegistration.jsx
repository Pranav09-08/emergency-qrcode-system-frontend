import React, { useState, useRef } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import {
  Container,
  Form,
  Button,
  Card,
  Spinner,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { PersonFill, EnvelopeFill, TelephoneFill, HeartFill, Download } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const EmployeeRegistration = () => {
  const [employee, setEmployee] = useState({
    full_name: "",
    email: "",
    phone: "",
    blood_group: "A+",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    medical_conditions: "",
    allergies: "",
  });

  const [qrValue, setQrValue] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uniqueCode, setUniqueCode] = useState(null);
  const qrRef = useRef(null);
  const [alert, setAlert] = useState(null);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleDownloadQR = () => {
    if (!qrRef.current || !uniqueCode) return;

    const svg = qrRef.current.querySelector("svg");
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const qrImageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = qrImageUrl;
      link.download = `${uniqueCode}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newUniqueCode = `EMP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setUniqueCode(newUniqueCode);
    const qrCodeUrl = `https://emergency-qrcode-system-frontend.vercel.app/employee?id=${newUniqueCode}`;
    setQrValue(qrCodeUrl);

    try {
      await axios.post("https://emergency-qrcode-system-backend.onrender.com/api/employees", {
        ...employee,
        qr_code: newUniqueCode,
      });
      setAlert({ type: "success", message: "✅ Employee Registered Successfully!" });
    } catch (error) {
      console.error("❌ Error registering employee:", error);
      setAlert({ type: "danger", message: "⚠️ Error registering employee." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow-lg p-4" style={{ maxWidth: "800px", width: "100%", borderRadius: "15px" }}>
        <h2 className="text-center mb-4 text-primary">Employee Registration</h2>
        {alert && (
          <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
            {alert.message}
          </Alert>
        )}
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label><PersonFill className="me-2" />Full Name</Form.Label>
                <Form.Control type="text" name="full_name" placeholder="Enter full name" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label><EnvelopeFill className="me-2" />Email</Form.Label>
                <Form.Control type="email" name="email" placeholder="Enter email" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label><TelephoneFill className="me-2" />Phone</Form.Label>
                <Form.Control type="text" name="phone" placeholder="Enter phone number" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label><HeartFill className="me-2" />Blood Group</Form.Label>
                <Form.Select name="blood_group" onChange={handleChange}>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Emergency Contact Name</Form.Label>
                <Form.Control type="text" name="emergency_contact_name" placeholder="Enter emergency contact name" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Emergency Contact Phone</Form.Label>
                <Form.Control type="text" name="emergency_contact_phone" placeholder="Enter emergency contact phone" onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Medical Conditions</Form.Label>
                <Form.Control type="text" name="medical_conditions" placeholder="Enter medical conditions" onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Allergies</Form.Label>
                <Form.Control type="text" name="allergies" placeholder="Enter allergies" onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-center">
            <Button variant="primary" type="submit" disabled={isSubmitting} className="w-50">
              {isSubmitting ? <Spinner as="span" animation="border" size="sm" /> : "Register Employee"}
            </Button>
          </div>
        </Form>
        {qrValue && (
          <div className="text-center mt-4">
            <h4 className="text-success">Generated QR Code</h4>
            <div ref={qrRef} className="bg-white p-3 d-inline-block border rounded shadow">
              <QRCode value={qrValue} size={200} />
            </div>
            <p className="mt-2 text-muted">Scan to view employee details</p>
            <Button variant="success" className="mt-3" onClick={handleDownloadQR}>
              <Download className="me-2" />Download QR Code
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
};

export default EmployeeRegistration;