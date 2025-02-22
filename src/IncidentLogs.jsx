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
                    "https://emergency-qrcode-system-backend.onrender.com/incident-log/get-incident"
                );
    
                console.log("Incident Logs API Response:", response.data);
    
                // Check if response.data is an array before mapping
                if (Array.isArray(response.data)) {
                    // Fetch recordings for each user in the incident logs
                    const logsWithRecordings = await Promise.all(
                        response.data.map(async (log) => {
                            try {
                                const recordingsResponse = await axios.get(
                                    `https://emergency-qrcode-system-backend.onrender.com/recordings/user/${log.user_id}`
                                );
    
                                console.log(`Recordings for user ${log.user_id}:`, recordingsResponse.data);
    
                                // Ensure recordings is always an array
                                const recordings = Array.isArray(recordingsResponse.data)
                                    ? recordingsResponse.data
                                    : [];
    
                                return { ...log, recordings };
                            } catch (recordingError) {
                                console.error(`Error fetching recordings for user ${log.user_id}:`, recordingError);
                                return { ...log, recordings: [] }; // Return empty array on error
                            }
                        })
                    );
    
                    setIncidentLogs(logsWithRecordings);
                } else {
                    console.error("Unexpected Incident Logs response structure:", response.data);
                    setIncidentLogs([]); // If response is not an array, set empty state
                }
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
                            <ListGroup.Item
                                key={index}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>User:</strong> {log.user_id} <br />
                                    <strong>Scanned By:</strong> {log.scanned_by_name} ({log.scanned_by_phone}) <br />
                                    <strong>Location:</strong> Lat {log.scan_location_latitude}, Long {log.scan_location_longitude} <br />
                                    <strong>Time:</strong> {new Date(log.scan_time).toLocaleString()}

                                    {/* Display Recordings */}
                                    {Array.isArray(log.recordings) && log.recordings.length > 0 ? (
                                        <div className="mt-3">
                                            <strong>Recordings:</strong>
                                            <ul>
                                                {log.recordings.map((rec) => (
                                                    <li key={rec.id}>
                                                        <div>
                                                            <audio controls>
                                                                <source src={rec.path} type={rec.mimeType} />
                                                                Your browser does not support audio playback.
                                                            </audio>
                                                            <div className="mt-2">
                                                                <strong>Filename:</strong> {rec.filename} <br />
                                                                <strong>Size:</strong> {(rec.size / 1024).toFixed(2)} KB <br />
                                                                <strong>Duration:</strong> {rec.duration} seconds <br />
                                                                <strong>Uploaded:</strong> {new Date(rec.createdAt).toLocaleString()}
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="mt-3 text-muted">
                                            No recordings found for this user.
                                        </div>
                                    )}
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
