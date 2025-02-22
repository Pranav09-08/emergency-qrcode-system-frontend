import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, ListGroup, Badge, Alert } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";

const IncidentReportsCard = () => {
    const [incidentLogs, setIncidentLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch incident logs when the component mounts
    useEffect(() => {
        const fetchIncidentLogs = async () => {
            try {
                const response = await axios.get(
                    "https://emergency-qrcode-system-backend.onrender.com/incident-logs/get-incident"
                );
                setIncidentLogs(response.data.logs);
            } catch (err) {
                setError("Failed to fetch incident logs");
                console.error("Error fetching incident logs:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchIncidentLogs();
    }, []);

    return (
        <Card className="mt-4 border-0 shadow-sm rounded-lg incident-card">
            <Card.Body>
                <h5 className="text-secondary">
                    <FaExclamationCircle className="me-2" />
                    Incident Reports
                </h5>
                {loading ? (
                    <Alert variant="info">Loading...</Alert>
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : incidentLogs.length > 0 ? (
                    <ListGroup variant="flush">
                        {incidentLogs.map((log, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>User:</strong> {log.user_id} <br />
                                    <strong>Scanned By:</strong> {log.scanned_by_name} ({log.scanned_by_phone}) <br />
                                    <strong>Location:</strong> Lat {log.scan_location_latitude}, Long {log.scan_location_longitude} <br />
                                    <strong>Time:</strong> {new Date(log.scan_time).toLocaleString()}
                                </div>
                                <Badge bg="info">New</Badge>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <Alert variant="info">No incident reports found.</Alert>
                )}
            </Card.Body>
        </Card>
    );
};

export default IncidentReportsCard;
