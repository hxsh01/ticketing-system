import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SeatGrid from '../components/SeatGrid';
const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
export default function HomePage({ user, movies: initialMovies }){
  const [movies, setMovies] = useState(initialMovies || []);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [pending, setPending] = useState([]);
  useEffect(()=>{
    axios.get(API + '/api/movies', { withCredentials: true }).then(r=> setMovies(r.data)).catch(console.error);
    axios.get(API + '/api/reservations/pending', { withCredentials: true }).then(r=> setPending(r.data)).catch(()=>{});
  }, []);
  return (
    <div style={{ padding:20 }}>
      <h2>Welcome</h2>
      {pending.length>0 && <div style={{ background:'#fffbdd', padding:10 }}>You have pending reservations. <button onClick={()=>setSelectedMovie(pending[0])}>Resume</button></div>}
      <div style={{ marginTop:10 }}>
        <h3>Select a movie</h3>
        <div style={{ display:'flex', gap:10 }}>
          {movies.map(m=> <button key={m._id} onClick={()=>setSelectedMovie(m)}>{m.title}</button>)}
        </div>
      </div>
      {selectedMovie && <div style={{ marginTop:20 }}><h3>{selectedMovie.title}</h3><SeatGrid movieId={selectedMovie._id} user={user} /></div>}
    </div>
  );
}
