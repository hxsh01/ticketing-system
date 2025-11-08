import React, { useEffect, useState } from 'react'
import SeatGrid from './SeatGrid'
import api from './api'

// NOTE: in this demo user is mocked. In real app use auth.
const DEMO_USER = { _id: '000000000000000000000001', name: 'DemoUser' };
const API_BASE = process.env.APP_BACKEND_URL || 'http://localhost:4000';

export default function App(){
  const [showId, setShowId] = useState('');
  const [pending, setPending] = useState([]);

  useEffect(() => {
    if (!DEMO_USER?._id) return;
    // check pending reservations
    fetch(`${API_BASE}/users/${DEMO_USER._id}/pending`).then(r=>r.json()).then(data=>{
      if (Array.isArray(data) && data.length) setPending(data);
    }).catch(console.error);
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h1>Movie Ticket Booking (demo)</h1>
      {pending.length>0 && (
        <div style={{ background: '#fffbdd', padding: 12, marginBottom: 12 }}>
          You have {pending.length} pending reserved seat(s). <a href="#/resume" onClick={(e)=>{ e.preventDefault(); setShowId(pending[0].showId) }}>Resume booking</a>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <input placeholder='Paste showId (or create via /dev/create-show)' value={showId} onChange={(e)=>setShowId(e.target.value)} style={{ width: 360, marginRight: 8 }} />
        <button onClick={()=>{ /* nothing: SeatGrid will load when showId set */ }}>Load</button>
        <button style={{ marginLeft: 8 }} onClick={async ()=>{
          // quick create show
          const res = await fetch(`${API_BASE}/dev/create-show`, { method: 'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({}) });
          const json = await res.json();
          if (json.showId) setShowId(json.showId);
        }}>Create demo show</button>
      </div>

      {showId ? <SeatGrid showId={showId} user={DEMO_USER} apiBase={API_BASE} /> : <div>Enter or create a show id to begin.</div>}
    </div>
  )
}
