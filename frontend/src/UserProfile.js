// src/UserProfile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile({ token, user }) {
  const [stats, setStats] = useState({
    questionsAsked: 0,
    answersGiven: 0,
    acceptedAnswers: 0,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch user's statistics. This assumes you have an endpoint for this,
    // or you can combine several API calls.
    // For demonstration, we'll assume an endpoint exists at /api/auth/profile/stats.
    axios
      .get('http://localhost:5001/api/auth/profile/stats', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user stats:", err);
        setError("Could not fetch user statistics.");
      });
  }, [token]);

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>User Profile</h2>
      <p><strong>Name:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>

      <hr />
      <h3>Your Activity</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><strong>Questions Asked:</strong> {stats.questionsAsked}</p>
      <p><strong>Answers Given:</strong> {stats.answersGiven}</p>
      <p><strong>Accepted Answers:</strong> {stats.acceptedAnswers}</p>
    </div>
  );
}

export default UserProfile;
