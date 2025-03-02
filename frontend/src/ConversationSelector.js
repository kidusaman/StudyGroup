// src/ConversationSelector.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ConversationSelector({ token, onSelect }) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5001/api/private-messages/conversations', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((res) => {
      console.log("Fetched conversations:", res.data);
      setConversations(res.data);
    })
    .catch((err) => console.error("Error fetching conversations:", err));
  }, [token]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3>Conversations</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {conversations.length === 0 && <li>No conversations yet.</li>}
        {conversations.map((conv, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <button 
              onClick={() => onSelect(conv.conversation_partner)}
              style={{ 
                padding: '8px 12px', 
                border: '1px solid #ccc', 
                borderRadius: '4px', 
                background: '#f9f9f9', 
                color: '#333',       // <-- Ensure dark text
                cursor: 'pointer' 
              }}
            >
              Conversation with User {conv.conversation_partner}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ConversationSelector;
