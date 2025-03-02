// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';

// 1) Import Bootstrap's CSS first
import 'bootstrap/dist/css/bootstrap.min.css';

// 2) Then import your custom CSS (if needed)
import './App.css';

import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
