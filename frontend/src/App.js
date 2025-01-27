/**
 * Main App component that handles routing and user authentication.
 * It checks if the user is authenticated via an access token in local storage.
 * If not authenticated, it shows an error message prompting login.
 * Renders Register, Login, or Dashboard pages based on authentication status.
 */

import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './components/register';
import Dashboard from './components/dashboard';
import Login from './components/login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    console.log('accessToken', accessToken);
    if (accessToken) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setError('Please log in to access the dashboard.');

      setTimeout(() => {
        setError('');
      }, 2000);
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard /> : <Login errorMessage={error} />} 
          />
          <Route path="/login" element={<Login errorMessage={error} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
