import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
axios.defaults.withCredentials = true;
const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:4000';
export default function App(){
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState([]);
  useEffect(()=>{
    axios.get(API + '/api/movies', { withCredentials:true }).then(r=> setMovies(r.data)).catch(()=>{});
  }, []);
  return user ? <HomePage user={user} movies={movies} /> : <LoginPage onLogin={setUser} />;
}
