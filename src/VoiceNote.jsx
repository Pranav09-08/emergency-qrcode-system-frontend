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
        <div className="container py-5">
            {error && <div className="alert alert-danger">{`⚠️ Error: ${error}`}</div>}

            {status === "recording" && (
                <div className="text-center mb-3">
                    ⏺ Recording: {seconds} seconds
                </div>
            )}

            <div className="d-flex justify-content-center gap-3">
                {status !== "recording" && (
                    <button
                        onClick={startRecording}
                        disabled={isUploading}
                        className="btn btn-primary btn-lg w-100 mb-3 p-4 fw-bold fs-4"
                    >
                        🎙 Start
                    </button>
                )}

                {status === "recording" && (
                    <button
                        onClick={stopRecording}
                        disabled={status !== "recording"}
                        className="btn btn-danger btn-lg w-100 mb-3 p-4 fw-bold fs-4"
                    >
                        ⏹ Stop
                    </button>
                )}
            </div>

            {isUploading && (
                <div className="text-center text-muted mb-3">
                    ⏳ Uploading recording...
                </div>
            )}

            {uploadSuccess && (
                <div className="alert alert-success text-center">
                    ✅ Recording submitted successfully!
                </div>
            )}
        </div>
    );
};

export default VoiceNote;
