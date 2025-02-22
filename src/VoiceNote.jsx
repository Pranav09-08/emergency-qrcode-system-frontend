<VoiceNote className="w-100 mb-3 p-5 fs-3" />

import React, { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";

const VoiceNote = () => {
    const [seconds, setSeconds] = useState(0);
    const [error, setError] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Add state for user_id
    const [userId, setUserId] = useState(null);

    const { status, startRecording, stopRecording, clearBlobUrl } =
        useReactMediaRecorder({
            audio: true,
            onStop: (blobUrl, blob) => {
                const duration = seconds;
                setSeconds(0);
                handleUpload(blob, duration);
            },
            onError: (err) => setError(err.message || "Recording error"),
            mediaRecorderOptions: {
                mimeType: getBestMimeType(),
            },
        });

    // Get optimal MIME type for current browser
    function getBestMimeType() {
        const mimeTypes = [
            "audio/webm;codecs=opus",
            "audio/mp4",
            "audio/mpeg",
            "audio/ogg",
        ];
        return mimeTypes.find(MediaRecorder.isTypeSupported) || "";
    }

    // Recording timer
    useEffect(() => {
        let interval;
        if (status === "recording") {
            interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [status]);

    // Fetch user_id (Replace with your authentication method)
    useEffect(() => {
        const fetchUserId = async () => {
            // Replace with your logic to get the logged-in user's ID
            const storedUserId = localStorage.getItem("user_id");
            console.log(storedUserId);
            setUserId(storedUserId);
        };

        fetchUserId();
    }, []);

    const handleUpload = async (blob, duration) => {
        if (!blob) {
            setError("No recording to upload");
            return;
        }

        try {
            setIsUploading(true);
            setError(null);
            setUploadSuccess(false);

            const formData = new FormData();
            const extension = blob.type.split("/")[1].split(";")[0] || "webm";
            formData.append("audio", blob, `recording_${Date.now()}.${extension}`);
            formData.append("duration", duration);
            formData.append("user_id", userId); // Pass the user_id

            const response = await axios.post(
                `https://emergency-qrcode-system-backend.onrender.com/recordings/voice/recordings/${userId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    timeout: 10000,
                }
            );

            if (response.status === 201) {
                setUploadSuccess(true);
                setTimeout(() => setUploadSuccess(false), 3000);
                clearBlobUrl();
            }
        } catch (err) {
            setError(`Upload failed: ${err.response?.data?.error || err.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="voice-recorder-container">

            {error && <div className="error-message">⚠️ Error: {error}</div>}

            {status === "recording" && (
                <div className="recording-timer">⏺ Recording: {seconds} seconds</div>
            )}

            <div className="controls">
                {status !== "recording" && (
                    <button
                        onClick={startRecording}
                        disabled={isUploading}
                        className="btn btn-primary btn-lg w-100 mb-3"
                    >
                        🎙 Start
                    </button>
                )}

                {status === "recording" && (
                    <button
                        onClick={stopRecording}
                        disabled={status !== "recording"}
                        className="btn btn-danger btn-lg w-100 mb-3 active"
                    >
                        ⏹ Stop
                    </button>
                )}
            </div>

            {isUploading && (
                <div className="upload-status">⏳ Uploading recording...</div>
            )}

            {uploadSuccess && (
                <div className="success-message">
                    ✅ Recording submitted successfully!
                </div>
            )}

            <style jsx="true">{`
                .voice-recorder-container {
                    padding: 30px;
                    max-width: 600px;
                    margin: 0 auto;
                    text-align: center;
                }
                .controls {
                    display: flex;
                    gap: 20px;
                    justify-content: center;
                    margin: 40px 0;
                }
                button {
                    padding: 15px 30px;
                    font-size: 1.5rem;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .record-btn {
                    background-color: #4caf50;
                    color: white;
                }
                .stop-btn.active {
                    background-color: #ff4444;
                    color: white;
                }
                .error-message {
                    color: red;
                    padding: 20px;
                    background-color: #ffe6e6;
                    border-radius: 8px;
                    margin: 20px 0;
                    text-align: center;
                    font-size: 1.2rem;
                }
                .success-message {
                    color: green;
                    margin-top: 15px;
                    padding: 15px;
                    background-color: #e6ffe6;
                    border-radius: 8px;
                    font-size: 1.2rem;
                    text-align: center;
                }
                .upload-status {
                    text-align: center;
                    color: #666;
                    margin-top: 20px;
                    font-size: 1.2rem;
                }
                .recording-timer {
                    font-size: 2rem;
                    margin: 30px 0;
                    color: #333;
                }
            `}</style>
        </div>
    );
};

export default VoiceNote;
