// src/GroupChat.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { groupMessagesByDate } from './utils/groupMessagesByDate'; // grouping function; make sure it's available
import { format } from 'date-fns';

function GroupChat({ user, token, socket }) {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Join the group room
    socket.emit("joinGroup", groupId);
    console.log(`Joined group-${groupId}`);

    // Fetch existing messages for the group
    axios.get(`http://localhost:5001/api/group-chat/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching group messages:", err));

    // Listener for new messages from the server
    const handleGroupMessage = (msgData) => {
      // Only update if the message is for the current group
      if (parseInt(msgData.group_id) === parseInt(groupId)) {
        // If the message is from the current user and includes a localId,
        // then update the matching local message's status to "sent"
        setMessages((prev) => {
          const index = prev.findIndex(m => m.localId && m.localId === msgData.localId);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...msgData, status: 'sent' };
            return updated;
          } else {
            return [...prev, msgData];
          }
        });
      }
    };

    socket.on("receiveGroupMessage", handleGroupMessage);

    return () => {
      socket.off("receiveGroupMessage", handleGroupMessage);
    };
  }, [groupId, token, socket]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Generate a temporary local ID for this message
    const localId = Math.random().toString(36).substr(2, 9);

    // Create the optimistic message with status 'sending'
    const tempMessage = {
      localId,
      group_id: groupId,
      user_id: user.id,
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
      username: user.username,
      status: 'sending'
    };

    // Add the optimistic message to the local state
    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage('');

    // Emit the message to the server, including the localId so that the server can echo it back
    socket.emit("sendGroupMessage", {
      groupId: parseInt(groupId),
      userId: user.id,
      message: newMessage.trim(),
      localId
    });
  };

  // Group messages by date for a cleaner display
  const grouped = groupMessagesByDate(messages);

  return (
    <Container fluid="md" className="mt-4">
      <Row>
        <Col xs={12}>
          <h2 className="text-center mb-4">Group Chat - Group {groupId}</h2>
          <div
            style={{
              border: '1px solid #ccc',
              height: 'calc(100vh - 200px)', // adjust 200px as needed to account for header, etc.
              overflowY: 'auto',
              marginBottom: '1rem',
              padding: '1rem',
              background: '#fff'
            }}
          >
            {grouped.map((group, idx) => (
              <div key={idx}>
                <div className="text-center text-muted mb-2" style={{ fontWeight: 'bold' }}>
                  {group.date}
                </div>
                {group.messages.map((msg, mIdx) => (
                  <div
                    key={mIdx}
                    style={{
                      margin: '10px 0',
                      padding: '8px',
                      borderRadius: '5px',
                      backgroundColor: msg.user_id === user.id ? '#e0ffe0' : '#f0f0f0',
                      color: '#333'
                    }}
                  >
                    <strong>{msg.username}</strong>: {msg.message}
                    <div style={{ fontSize: '0.8em', color: '#555' }}>
                      {format(new Date(msg.created_at), 'hh:mm a')}
                      {msg.user_id === user.id && msg.status === 'sending' && (
                        <span style={{ marginLeft: '8px', color: 'orange' }}>(sending...)</span>
                      )}
                      {msg.user_id === user.id && msg.status === 'error' && (
                        <span style={{ marginLeft: '8px', color: 'red' }}>(error!)</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <Form onSubmit={handleSendMessage}>
            <Row>
              <Col xs={9}>
                <Form.Control
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </Col>
              <Col xs={3}>
                <Button type="submit" variant="primary" className="w-100">
                  Send
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default GroupChat;
