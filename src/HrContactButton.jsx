import React, { useState, useEffect } from "react";
import axios from "axios";  // Import axios for API calls

const HrContactButton = () => {
    const [hrDetails, setHrDetails] = useState(null);

    // Fetch HR details when the component mounts
    useEffect(() => {
        const fetchHrDetails = async () => {
            try {
                const response = await axios.get('https://emergency-qrcode-system-backend.onrender.com/admin/getadmins'); // Replace with your actual backend URL
                setHrDetails(response.data);
                console.log(response.data);  // Log HR details for debugging
            } catch (error) {
                console.error('Error fetching HR details:', error);
            }
        };

        fetchHrDetails();
    }, []); // Empty dependency array means this runs once when the component mounts

    const handleButtonClick = () => {
        if (hrDetails) {
            const phoneNumber = hrDetails.mobile_number;
            window.location.href = `tel:${phoneNumber}`; // Trigger the dial
        }
    };

    return (
        <div>
            <div id="container">
                <button className="learn-more" onClick={handleButtonClick}>
                    <span className="circle" aria-hidden="true">
                        <span className="icon arrow" />
                    </span>
                    <span className="button-text">Call HR</span>
                </button>
            </div>
        </div>
    );
};

export default HrContactButton;
