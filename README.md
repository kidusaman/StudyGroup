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
   cd peer-learning-backendInstall dependencies:
npm install
Create a .env file in the root directory with the following variables:
PORT=5001
DB_USER=your_db_user
DB_HOST=your_db_host
DB_NAME=your_db_name
DB_PASS=your_db_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
Start the backend server:
npm start
Frontend
Clone the repository:
git clone https://github.com/yourusername/peer-learning-frontend.git
cd peer-learning-frontend
Install dependencies:
npm install
Create a .env file in the root directory with the following:
REACT_APP_API_URL=http://localhost:5001
Start the frontend:
npm start
Configuration

Ensure that Node.js and PostgreSQL are installed.
Modify .env files as needed for your setup.
For email verification, configure SMTP settings properly.
Usage

Run both backend and frontend servers.
Open the frontend in your browser.
Sign up or log in.
Ask and answer questions, join study groups, and chat in real time.
Deployment

Backend can be deployed using Heroku, Render, or Vercel.
Frontend can be deployed on Netlify or Vercel.
Update .env files with production values before deployment.
Contributing

Contributions are welcome! To contribute:
Fork the repository.
Create a new branch:
git checkout -b feature-branch
Commit changes:
git commit -m "Added new feature"
Push to the branch:
git push origin feature-branch
Create a Pull Request.
