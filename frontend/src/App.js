// src/App.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';

// React-Bootstrap components
import { Navbar, Container, Nav } from 'react-bootstrap';

// Your own components
import Login from './Login';
import Signup from './Signup'; 
// import Chat from './Chat'; // (Optional) comment out if you want to remove Chat entirely
import QuestionsList from './QuestionsList';
import QuestionDetail from './QuestionDetail';
import AskQuestion from './AskQuestion';
import Notifications from './Notifications';
import StudyGroupList from './StudyGroupList';
import GroupChat from './GroupChat';
import UserProfile from './UserProfile';

const socket = io('http://localhost:5001');

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Check localStorage for token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !token) {
      setToken(storedToken);
      axios.get('http://localhost:5001/api/auth/profile', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then((res) => {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
    }
  }, [token]);

  // If you want to remove all private chat logic, you can comment out this socket code
  useEffect(() => {
    if (user && user.id) {
      socket.emit('joinPrivateChat', user.id);
      console.log(`Joined private chat room: user-${user.id}`);
    }
  }, [user]);

  // If no user, show login/signup routes
  if (!user) {
    return (
      <BrowserRouter>
        <Container className="mt-4">
          <Routes>
            <Route path="/signup" element={<Signup setUser={setUser} setToken={setToken} />} />
            <Route path="/login" element={<Login setUser={setUser} setToken={setToken} />} />
            <Route path="*" element={<Login setUser={setUser} setToken={setToken} />} />
          </Routes>
        </Container>
      </BrowserRouter>
    );
  }

  // Main application UI when user is logged in
  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Peer Learning Platform</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Removed the Private Chat link */}
              <Nav.Link as={Link} to="/group-list">Study Groups</Nav.Link>
              <Nav.Link as={Link} to="/ask">Ask a Question</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            </Nav>
            <Notifications user={user} socket={socket} />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Page Content */}
      <Container className="mt-4">
        <Routes>
          {/* Home route shows the Questions List */}
          <Route path="/" element={<QuestionsList token={token} />} />

          {/* Question detail route */}
          <Route
            path="/question/:questionId"
            element={<QuestionDetail token={token} user={user} />}
          />

          {/* Ask a question */}
          <Route
            path="/ask"
            element={<AskQuestion token={token} />}
          />

          {/* (Optional) Private chat page - comment out if you want to remove it entirely
          <Route
            path="/chat"
            element={<Chat user={user} token={token} socket={socket} />}
          />
          */}

          {/* Study group list */}
          <Route
            path="/group-list"
            element={<StudyGroupList token={token} />}
          />

          {/* Group chat page */}
          <Route
            path="/group-chat/:groupId"
            element={<GroupChat user={user} token={token} socket={socket} />}
          />

          {/* User Profile */}
          <Route
            path="/profile"
            element={<UserProfile token={token} user={user} />}
          />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
