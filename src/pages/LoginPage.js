import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = process.env.REACT_APP_BACKEND_URL;

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mode, setMode] = useState('login');
  const navigate = useNavigate(); // <-- for redirect

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let res;
      if (mode === 'signup') {
        res = await axios.post(
          `${API}/api/auth/signup`,
          { name, email, password },
          { withCredentials: true }
        );
      } else {
        res = await axios.post(
          `${API}/api/auth/login`,
          { email, password },
          { withCredentials: true }
        );
      }

      // Update parent state
      onLogin(res.data.user);

      // Redirect to homepage
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>{mode === 'signup' ? 'Sign up' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div>
            <label>Name</label>
            <input value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}
        <div>
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <button type='submit'>{mode === 'signup' ? 'Sign up' : 'Login'}</button>
      </form>
      <div style={{ marginTop: 10 }}>
        <button onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}>
          {mode === 'signup' ? 'Have an account? Login' : 'Create account'}
        </button>
      </div>
    </div>
  );
}
