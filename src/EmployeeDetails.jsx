import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import VoiceNote from "./VoiceNote";
import HrContactButton from "./HrContactButton";

const EmployeeDetails = () => {
    const [searchParams] = useSearchParams();
    const qr_code = searchParams.get("id");
    console.log(qr_code); // Check if qr_code is being fetched correctly    
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [showSOSModal, setShowSOSModal] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    useEffect(() => {
        if (!qr_code) {
            setError("Invalid QR Code");
            return;
        }


        axios.get(`https://emergency-qrcode-system-backend.onrender.com/api/employees/${qr_code}`)
            .then(response => {
                console.log(response.data); // Log the response to check if the data is being received correctly
                setEmployee(response.data);
                localStorage.setItem("user_id", response.data.user_id);
            })
            .catch(err => {
                console.error("Error fetching employee details:", err);
                setError("Employee not found");
            });
    }, [qr_code]);


    const handleSOS = async (user_id) => {
        try {
            // Assume these values are dynamically populated
            const scanned_by_name = "John Doe"; // Replace with actual data
            const scanned_by_phone = "123-456-7890"; // Replace with actual data
            let latitude, longitude;
    
            // Capture the geolocation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    latitude = position.coords.latitude;
                    longitude = position.coords.longitude;
    
                    // 1. Sending the SOS alert email
                    try {
                        const response = await axios.post(
                            `https://emergency-qrcode-system-backend.onrender.com/sos/send-alert?user_id=${user_id}`
                        );
    
                        if (response.data.message) {
                            alert(response.data.message); // Show success message if sent successfully
                        }
                    } catch (error) {
                        console.error("Error sending SOS alert:", error.response?.data || error.message);
                        alert("Failed to send SOS alert. Please try again.");
                    }
    
                    // 2. Storing the incident log in the database
                    try {
                        const incidentResponse = await axios.post(
                            'https://emergency-qrcode-system-backend.onrender.com/incident-log/incident', 
                            {
                                user_id,
                                scanned_by_name,
                                scanned_by_phone,
                                scan_location_latitude: latitude,
                                scan_location_longitude: longitude
                            }
                        );
    
                        if (incidentResponse.data.message) {
                            console.log("Incident log added successfully");
                        }
                    } catch (error) {
                        console.error("Error storing incident log:", error.response?.data || error.message);
                        alert("Failed to store incident log. Please try again.");
                    }
    
                }, (error) => {
                    console.error("Error getting location:", error);
                    alert("Failed to get location. Please try again.");
                });
            } else {
                alert("Geolocation is not supported by your browser.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        }
    };
    

    return (
        <Container fluid className="d-flex justify-content-center align-items-center min-vh-100 bg-light p-4">
            <Card className="shadow-lg p-4 w-100 mx-auto" style={{ maxWidth: "500px", borderRadius: "16px", background: "#ffffff" }}>
                <Card.Body>
                    <h2 className="text-left text-primary fw-bold">Employee Details</h2>
                    <hr />
                    {error ? (
                        <Alert variant="danger" className="text-left">{error}</Alert>
                    ) : employee ? (
                        <>
                            <Card className="mb-3 border-0 shadow-sm">
                                <Card.Body>
                                    <p><strong>Name:</strong> {employee.full_name}</p>
                                    <p><strong>Email:</strong> {employee.email}</p>
                                    <p><strong>Phone:</strong> {employee.phone}</p>
                                    <p><strong>Blood Group:</strong> {employee.blood_group}</p>
                                    <p><strong>Emergency Contact:</strong> {employee.emergency_contact_name} ({employee.emergency_contact_phone})</p>
                                    <p><strong>Medical Conditions:</strong> {employee.medical_conditions || "None"}</p>
                                    <p><strong>Allergies:</strong> {employee.allergies || "None"}</p>
                                </Card.Body>
                            </Card>

                            <Button
                                variant="danger"
                                className="w-100 mb-3 p-4 fw-bold fs-4"
                                onClick={() => handleSOS(employee.user_id)} // Pass employee.user_id dynamically
                            >
                                🚨 SOS Alert
                            </Button>

                            {/* Add custom styling for VoiceNote component, assuming it has a button for recording */}
                            <VoiceNote />
                            <HrContactButton/>



                        </>
                    ) : (
                        <div className="text-center">
                            <Spinner animation="border" variant="primary" />
                            <p>Loading...</p>
                        </div>
                    )}
                </Card.Body>
            </Card>

        </Container>
    );
};

export default EmployeeDetails;
