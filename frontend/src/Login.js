// src/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login({ setUser, setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { email, password });
      const token = res.data.token;
      setToken(token);

      const profileRes = await axios.get('http://localhost:5001/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(profileRes.data.user);
    } catch (err) {
      console.error(err);
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Email:</label>
          <br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%' }} 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <br />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%' }} 
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Login</button>
      </form>
      <p style={{ marginTop: '10px' }}>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
}

export default Login;
