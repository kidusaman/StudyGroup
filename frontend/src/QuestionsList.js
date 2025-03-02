// src/QuestionsList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function QuestionsList({ token }) {
  const [questions, setQuestions] = useState([]);

  // Fetch all questions along with the asker's username
  useEffect(() => {
    axios.get('http://localhost:5001/api/questions', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        console.log("Fetched questions:", res.data);
        setQuestions(res.data);
      })
      .catch((err) => console.error("Error fetching questions:", err));
  }, [token]);

  return (
    <div className="container" style={{ marginTop: '20px' }}>
      <h2>Questions List</h2>
      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        questions.map((q) => (
          <div
            key={q.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              background: '#fff'
            }}
          >
            <Link to={`/question/${q.id}`} style={{ textDecoration: 'none', color: '#333' }}>
              <h3>{q.title}</h3>
            </Link>
            <p>{q.body}</p>
            <p style={{ fontStyle: 'italic', color: '#555' }}>
              Asked by: {q.username}
            </p>
            {/* Removed any Upvote/Downvote UI here */}
          </div>
        ))
      )}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/ask" style={{ fontSize: '18px', color: '#5151e5', textDecoration: 'none', fontWeight: 'bold' }}>
          Ask a Question
        </Link>
      </div>
    </div>
  );
}

export default QuestionsList;
