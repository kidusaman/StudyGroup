// src/QuestionDetail.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function QuestionDetail({ token, user }) {
  const { questionId } = useParams(); // Get the question ID from the URL
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  const [error, setError] = useState('');
  
  // State for editing answers
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedBody, setEditedBody] = useState('');
  
  // State for editing the question
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editedQuestionTitle, setEditedQuestionTitle] = useState('');
  const [editedQuestionBody, setEditedQuestionBody] = useState('');
  
  // State for showing "More" menu for answers
  const [expandedAnswerId, setExpandedAnswerId] = useState(null);

  useEffect(() => {
    // Fetch the question details
    axios
      .get(`http://localhost:5001/api/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setQuestion(res.data);
        // Initialize the edited values with current question details
        setEditedQuestionTitle(res.data.title);
        setEditedQuestionBody(res.data.body);
      })
      .catch((err) => {
        console.error("Error fetching question:", err);
        setError("Could not fetch question.");
      });

    // Fetch the answers for the question
    axios
      .get(`http://localhost:5001/api/answers/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setAnswers(res.data))
      .catch((err) => {
        console.error("Error fetching answers:", err);
        setError("Could not fetch answers.");
      });
  }, [questionId, token]);

  // Submit a new answer
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;
    try {
      const res = await axios.post(
        'http://localhost:5001/api/answers',
        { questionId, body: newAnswer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const createdAnswer = res.data.answer;
      setAnswers([...answers, createdAnswer]);
      setNewAnswer('');
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Failed to submit answer.");
    }
  };

  // Submit edited question
  const handleSubmitQuestionEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/questions/${questionId}`,
        { title: editedQuestionTitle, body: editedQuestionBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setQuestion(res.data.question);
      setIsEditingQuestion(false);
    } catch (err) {
      console.error("Error updating question:", err);
      setError("Failed to update question.");
    }
  };

  // Delete the question (if owner)
  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Redirect or update state as needed after deletion
      // For example, you might redirect to the Questions List page:
      window.location.href = '/';
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question.");
    }
  };

  // Upvote an answer
  const handleAnswerUpvote = async (answerId) => {
    try {
      const res = await axios.post(
        `http://localhost:5001/api/answers/${answerId}/upvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data.answer;
      setAnswers((prev) =>
        prev.map((ans) => (ans.id === updated.id ? updated : ans))
      );
    } catch (err) {
      console.error("Error upvoting answer:", err);
      setError("Failed to upvote answer.");
    }
  };

  // Downvote an answer
  const handleAnswerDownvote = async (answerId) => {
    try {
      const res = await axios.post(
        `http://localhost:5001/api/answers/${answerId}/downvote`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = res.data.answer;
      setAnswers((prev) =>
        prev.map((ans) => (ans.id === updated.id ? updated : ans))
      );
    } catch (err) {
      console.error("Error downvoting answer:", err);
      setError("Failed to downvote answer.");
    }
  };

  // Delete an answer
  const handleDeleteAnswer = async (answerId) => {
    try {
      await axios.delete(`http://localhost:5001/api/answers/${answerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnswers(answers.filter((ans) => ans.id !== answerId));
    } catch (err) {
      console.error("Error deleting answer:", err);
      setError("Failed to delete answer.");
    }
  };

  // Start editing an answer
  const handleStartEditing = (answerId, currentBody) => {
    setEditingAnswerId(answerId);
    setEditedBody(currentBody);
    setExpandedAnswerId(null); // Collapse the "More" menu if open
  };

  // Cancel editing an answer
  const handleCancelEditing = () => {
    setEditingAnswerId(null);
    setEditedBody('');
  };

  // Submit the edited answer
  const handleSubmitEdit = async (answerId) => {
    try {
      const res = await axios.put(
        `http://localhost:5001/api/answers/${answerId}`,
        { body: editedBody },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnswers((prev) =>
        prev.map((ans) => (ans.id === answerId ? res.data.answer : ans))
      );
      setEditingAnswerId(null);
      setEditedBody('');
    } catch (err) {
      console.error("Error updating answer:", err);
      setError("Failed to update answer.");
    }
  };

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }
  if (!question) {
    return <div>Loading question...</div>;
  }

  return (
    <div style={{ maxWidth: '700px', margin: '20px auto' }}>
      {/* Question Details */}
      {isEditingQuestion ? (
        <>
          <input
            type="text"
            style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            value={editedQuestionTitle}
            onChange={(e) => setEditedQuestionTitle(e.target.value)}
          />
          <textarea
            rows="4"
            style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
            value={editedQuestionBody}
            onChange={(e) => setEditedQuestionBody(e.target.value)}
          />
          <button onClick={handleSubmitQuestionEdit} style={{ marginRight: '10px' }}>
            Save
          </button>
          <button onClick={() => setIsEditingQuestion(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{question.title}</h2>
          <p>{question.body}</p>
          {question.tags && <p><strong>Tags:</strong> {question.tags.join(', ')}</p>}
          {question.user_id === user.id && (
            <div style={{ marginBottom: '20px' }}>
              <button onClick={() => { setIsEditingQuestion(true); setEditedQuestionTitle(question.title); setEditedQuestionBody(question.body); }} style={{ marginRight: '10px' }}>
                Edit Question
              </button>
              <button onClick={handleDeleteQuestion}>
                Delete Question
              </button>
            </div>
          )}
        </>
      )}

      <hr />
      
      {/* Answers Section */}
      <h3>Answers</h3>
      {answers.length === 0 ? (
        <p>No answers yet. Be the first to answer!</p>
      ) : (
        answers.map((ans) => {
          console.log("Answer user_id:", ans.user_id, "Logged-in user_id:", user?.id);
          return (
            <div 
              key={ans.id} 
              style={{
                padding: '10px', 
                marginBottom: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '5px', 
                background: '#f9f9f9',
                position: 'relative'
              }}
            >
              {editingAnswerId === ans.id ? (
                <>
                  <textarea
                    rows="3"
                    style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
                    value={editedBody}
                    onChange={(e) => setEditedBody(e.target.value)}
                  />
                  <button onClick={() => handleSubmitEdit(ans.id)} style={{ marginRight: '10px' }}>
                    Save
                  </button>
                  <button onClick={handleCancelEditing}>Cancel</button>
                </>
              ) : (
                <>
                  <p>{ans.body}</p>
                  <p style={{ fontSize: '0.8em', color: '#555' }}>
                    By {ans.username} on {new Date(ans.created_at).toLocaleString()}
                  </p>
                  <p style={{ fontWeight: 'bold' }}>Upvotes: {ans.upvotes}</p>
                  <div>
                    <button onClick={() => handleAnswerUpvote(ans.id)} style={{ marginRight: '10px' }}>
                      Upvote
                    </button>
                    <button onClick={() => handleAnswerDownvote(ans.id)}>
                      Downvote
                    </button>
                  </div>
                  {/* "More" menu for answer actions (only if owner) */}
                  {ans.user_id === user.id && (
                    <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                      <button 
                        onClick={() => setExpandedAnswerId(expandedAnswerId === ans.id ? null : ans.id)}
                        style={{
                          background: 'red',       // Debug: bright red
                          color: '#fff',
                          border: 'none',
                          borderRadius: '3px',
                          fontSize: '1em',
                          padding: '5px 10px',
                          cursor: 'pointer'
                        }}
                      >
                        •••
                      </button>
                      {expandedAnswerId === ans.id && (
                        <div style={{
                          position: 'absolute',
                          top: '40px',
                          right: '0',
                          background: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '5px',
                          padding: '5px',
                          zIndex: 1000
                        }}>
                          <button 
                            onClick={() => { handleStartEditing(ans.id, ans.body); setExpandedAnswerId(null); }}
                            style={{ display: 'block', width: '100%', marginBottom: '5px' }}
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => { handleDeleteAnswer(ans.id); setExpandedAnswerId(null); }}
                            style={{ display: 'block', width: '100%' }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })
      )}

      <hr />
      <h3>Submit Your Answer</h3>
      <form onSubmit={handleSubmitAnswer}>
        <textarea
          rows="4"
          style={{ width: '100%', marginBottom: '10px', padding: '10px' }}
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          placeholder="Type your answer..."
        />
        <button type="submit" style={{ padding: '8px 16px' }}>Submit Answer</button>
      </form>
    </div>
  );
}

export default QuestionDetail;
