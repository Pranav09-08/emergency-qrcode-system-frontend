import React, { useState, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import axios from "axios";

const VoiceNote = () => {
	const [seconds, setSeconds] = useState(0);
	const [error, setError] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadSuccess, setUploadSuccess] = useState(false);

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

			const response = await axios.post(
				"http://localhost:5001/recordings/voice/recordings",
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
			<h1>Voice Recorder</h1>

			{error && <div className="error-message">⚠️ Error: {error}</div>}

			{status === "recording" && (
				<div className="recording-timer">⏺ Recording: {seconds} seconds</div>
			)}

			<div className="controls">
				{/* Only show the start button if not recording */}
				{status !== "recording" && (
					<button
						onClick={startRecording}
						disabled={isUploading}
						className="record-btn"
					>
						<svg className="mic-icon" viewBox="0 0 24 24">
							<path
								fill="currentColor"
								d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z"
							/>
						</svg>
					</button>
				)}

				{/* Show Pause button only when recording */}
				{status === "recording" && (
					<button
						onClick={stopRecording}
						disabled={status !== "recording"}
						className="stop-btn active"
					>
						<svg className="pause-icon" viewBox="0 0 24 24">
							<path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
						</svg>
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

			{/* CSS Styles */}
			<style jsx="true">{`
				.voice-recorder-container {
					padding: 20px;
					max-width: 600px;
					margin: 0 auto;
					touch-action: manipulation;
				}

				h1 {
					text-align: center;
					color: #333;
					margin-bottom: 30px;
				}

				.controls {
					display: flex;
					gap: 15px;
					justify-content: center;
					margin: 30px 0;
				}

				button {
					padding: 20px 30px;
					font-size: 1.1rem;
					border: none;
					border-radius: 50px;
					cursor: pointer;
					transition: all 0.3s ease;
					min-width: 150px;
				}

				.record-btn {
					background-color: #4caf50;
					color: white;
				}

				.record-btn.recording {
					background-color: #6b6b6b;
					cursor: not-allowed;
				}

				.stop-btn {
					background-color: #6b6b6b;
					color: white;
				}

				.stop-btn.active {
					background-color: #ff4444;
				}

				.error-message {
					color: red;
					padding: 15px;
					background-color: #ffe6e6;
					border-radius: 8px;
					margin: 20px 0;
					text-align: center;
				}

				.success-message {
					color: green;
					margin-top: 10px;
					padding: 10px;
					background-color: #e6ffe6;
					border-radius: 4px;
					text-align: center;
				}

				.upload-status {
					text-align: center;
					color: #666;
					margin-top: 10px;
				}

				.recording-timer {
					text-align: center;
					font-size: 1.2rem;
					margin: 20px 0;
					color: #666;
				}
			`}</style>
		</div>
	);
};

export default VoiceNote;
