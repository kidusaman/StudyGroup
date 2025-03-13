# Peer Learning Platform

A full-stack web application that enables students to ask and answer questions, join study groups, and communicate in real time using chat features. The backend is built with Node.js, Express, and Socket.io, while the frontend is built with React and React-Bootstrap. PostgreSQL is used for the database.

## Table of Contents
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

### Question & Answer Forum:
- Users can post questions and answers.
- Upvote and downvote system for answers.

### Real-Time Chat:
- Group chat for study groups using Socket.io.
- (Optional) Private messaging between users.

### User Authentication:
- Signup and login using JWT-based authentication.
- Email verification (optional; can be disabled for testing).

### User Profiles:
- View profile information and activity statistics (number of questions asked, answers given, accepted answers, etc.).

### Notifications:
- Real-time notifications for actions such as when an answer is upvoted or accepted.

## Architecture

### Backend (Node.js, Express, Socket.io):
- **Routing:** RESTful API endpoints for authentication, questions, answers, notifications, chat, and study groups.
- **Database:** PostgreSQL database accessed via the `pg` module.
- **Real-Time:** Socket.io used for real-time chat and notifications.
- **Middleware:** Custom authentication middleware for protected routes.

### Frontend (React, React-Bootstrap):
- **Components:** Pages for Login, Signup, Question List, Question Detail, Ask a Question, Study Group List, Group Chat, and User Profile.
- **Notifications:** React-Toastify integrated with Socket.io to display real-time notifications.
- **Responsive Design:** Layout styled with React-Bootstrap and custom CSS for responsiveness.


## Installation

### Backend
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/peer-learning-backend.git
   cd peer-learning-backend
2. Install dependencies:
   ```sh
   npm install
