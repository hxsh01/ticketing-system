import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.APP_BACKEND_URL;

export default function HomePage({ user, movies: initialMovies }) {
  const [movies, setMovies] = useState(initialMovies || []);
  const [pending, setPending] = useState([]);
  const navigate = useNavigate(); // <-- for programmatic navigation

  useEffect(() => {
    axios.get(API + '/api/movies', { withCredentials: true })
      .then(r => setMovies(r.data))
      .catch(console.error);

    axios.get(API + '/api/reservations/pending', { withCredentials: true })
      .then(r => setPending(r.data))
      .catch(() => {});
  }, []);

  const resumeReservation = (reservation) => {
    // Assuming reservation contains movieId
    navigate(`/seat-selection/${reservation.movieId}`);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Welcome</h2>

      {pending.length > 0 && (
        <div style={{ background: '#fffbdd', padding: 10 }}>
          You have pending reservations. 
          <button onClick={() => resumeReservation(pending[0])}>Resume</button>
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <h3>Select a movie</h3>
        <div style={{ display: 'flex', gap: 10 }}>
          {movies.map(m => (
            <button key={m._id} onClick={() => navigate(`/seat-selection/${m._id}`)}>
              {m.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
