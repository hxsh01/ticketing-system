import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css';

const API = process.env.REACT_APP_BACKEND_URL;

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login');
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res;
      if (mode === 'signup') {
        res = await axios.post(`${API}/api/auth/signup`, { name, email, password }, { withCredentials: true });
      } else {
        res = await axios.post(`${API}/api/auth/login`, { email, password }, { withCredentials: true });
      }
      onLogin(res.data.user);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{mode === 'signup' ? 'Create Account' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <>
              <label>Name</label>
              <input placeholder = "Enter your Name" value={name} onChange={e => setName(e.target.value) } required />
            </>
          )}
          <label>Email</label>
          <input placeholder='Enter your Email' value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          <label>Password</label>
          <input placeholder='Enter your Password' type='password' value={password} onChange={e => setPassword(e.target.value)} required />
          <button type='submit'>{mode === 'signup' ? 'Sign Up' : 'Login'}</button>
        </form>
        <div className="mode-toggle">
          {mode === 'signup' ? (
            <button onClick={() => setMode('login')}>Already have an account? Log in</button>
          ) : (
            <button class={"link-button"} onClick={() => setMode('signup')}>New user? Create account</button>
          )}
        </div>
      </div>
    </div>
  );
}
