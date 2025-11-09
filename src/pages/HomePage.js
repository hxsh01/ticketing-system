import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';

const API = process.env.REACT_APP_BACKEND_URL;

export default function HomePage({ user, movies: initialMovies }) {
  const [movies, setMovies] = useState(initialMovies || []);
  const [pending, setPending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/movies`, { withCredentials: true })
      .then(r => setMovies(r.data))
      .catch(console.error);

    axios.get(`${API}/api/reservations/pending`, { withCredentials: true })
      .then(r => setPending(r.data))
      .catch(() => {});
  }, []);

  const resumeReservation = (reservation) => {
    navigate(`/seat-selection/${reservation.movieId}`);
  };

  return (
    <div className="container">
      <div className="home-header">
        <h2>Welcome, {user?.name || "Guest"}</h2>
        <button onClick={() => navigate('/login')}>Logout</button>
      </div>

      {pending.length > 0 && (
        <div className="pending-banner">
          🎟️ You have {pending.length} pending reservation(s).{" "}
          <button onClick={() => resumeReservation(pending[0])}>Resume Booking</button>
        </div>
      )}

      <h3>Available Movies</h3>
      <div className="movie-list">
        {movies.map(m => (
          <div key={m._id} className="movie-card">
            <h4>{m.title}</h4>
            <button onClick={() => navigate(`/seat-selection/${m._id}`)}>Book Seats</button>
          </div>
        ))}
      </div>
    </div>
  );
}
