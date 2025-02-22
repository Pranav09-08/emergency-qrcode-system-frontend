// frontend/src/Users.jsx

import React, { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);

  // Fetch users data from the backend
  const fetchUsers = async () => {
    try {
      const response = await fetch('https://emergency-qrcode-system-backend.onrender.com/api/users'); // Update with your backend URL
      const data = await response.json();
      setUsers(data);  // Store fetched users in state
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Users List</h1>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            <p><strong>Full Name:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Blood Group:</strong> {user.blood_group}</p>
            <p><strong>Emergency Contact:</strong> {user.emergency_contact_name} ({user.emergency_contact_phone})</p>
            <p><strong>Medical Conditions:</strong> {user.medical_conditions}</p>
            <p><strong>Allergies:</strong> {user.allergies}</p>
            <p><strong>QR Code:</strong> {user.qr_code}</p>
            <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
