// src/AskQuestion.js
import React, { useState } from 'react';
import axios from 'axios';

function AskQuestion({ token }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5001/api/questions',
        {
          title,
          body,
          tags: tags.split(',').map(tag => tag.trim())
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Question posted successfully!');
      setTitle('');
      setBody('');
      setTags('');
    } catch (err) {
      console.error(err);
      setError('Failed to post question.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto' }}>
      <h2>Ask a Question</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Title:</label>
          <br />
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Body:</label>
          <br />
          <textarea 
            rows="5" 
            value={body} 
            onChange={(e) => setBody(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Tags (comma-separated):</label>
          <br />
          <input 
            type="text" 
            value={tags} 
            onChange={(e) => setTags(e.target.value)} 
            style={{ width: '100%', padding: '8px' }} 
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px' }}>Post Question</button>
      </form>
    </div>
  );
}

export default AskQuestion;
