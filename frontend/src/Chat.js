// GroupChat.js (React-Bootstrap example)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { groupMessagesByDate } from './utils/groupMessagesByDate';
import { format } from 'date-fns';

function GroupChat({ user, token, socket }) {
  const { groupId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.emit("joinGroup", groupId);

    axios.get(`http://localhost:5001/api/group-chat/${groupId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching group messages:", err));

    const handleGroupMessage = (msgData) => {
      if (parseInt(msgData.group_id) === parseInt(groupId)) {
        setMessages((prev) => [...prev, msgData]);
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

    socket.emit("sendGroupMessage", {
      groupId: parseInt(groupId),
      userId: user.id,
      message: newMessage.trim()
    });

    // Optimistic update
    setMessages((prev) => [
      ...prev,
      {
        group_id: groupId,
        user_id: user.id,
        message: newMessage.trim(),
        created_at: new Date().toISOString(),
        username: user.username
      }
    ]);
    setNewMessage('');
  };

  // Group messages by date
  const grouped = groupMessagesByDate(messages);

  return (
    <Container fluid="md" className="mt-4">
      <Row>
        <Col xs={12}>
          <h2 className="text-center mb-4">Group Chat - Group {groupId}</h2>

          {/* Chat box: make it fill the viewport minus 200px */}
          <div
            style={{
              border: '1px solid #ccc',
              marginBottom: '1rem',
              padding: '1rem',
              background: '#fff',
              height: 'calc(100vh - 200px)',  // <--- KEY PART
              overflowY: 'auto'
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
                      backgroundColor: msg.user_id === user.id ? '#e0ffe0' : '#f0f0f0'
                    }}
                  >
                    <strong>{msg.username}</strong>: {msg.message}
                    <div style={{ fontSize: '0.8em', color: '#555' }}>
                      {format(new Date(msg.created_at), 'hh:mm a')}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Input row */}
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
