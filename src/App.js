import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SeatSelectionPage from './pages/SeatSelectionPage';

axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';

export default function App() {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    axios.get(API + '/api/movies')
      .then(r => setMovies(r.data))
      .catch((err) => {console.error('Failed to fetch movies:', err)});
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={setUser} />}
        />
        <Route
          path="/"
          element={user ? <HomePage user={user} movies={movies} /> : <Navigate to="/login" />}
        />
        <Route
          path="/seat-selection/:movieId"
          element={user ? <SeatSelectionPage user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
