import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Alert } from "react-bootstrap";
import VoiceNote from "./VoiceNote";

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
            // Sending the request with user_id as a query parameter in the URL
            const response = await axios.post(`https://emergency-qrcode-system-backend.onrender.com/sos/send-alert?user_id=${user_id}`);

            if (response.data.message) {
                alert(response.data.message); // Show success message if sent successfully
            }
        } catch (error) {
            console.error("Error sending SOS alert:", error.response?.data || error.message);
            alert("Failed to send SOS alert. Please try again.");
        }
    };


    const confirmSOS = () => {
        if (employee) {
            alert(`🚨 SOS Alert Sent to ${employee.emergency_contact_name} (${employee.emergency_contact_phone})`);
        } else {
            alert("⚠️ No emergency contact found.");
        }
        setShowSOSModal(false);
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioUrl(audioUrl);
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert("⚠️ Microphone access denied.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
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
