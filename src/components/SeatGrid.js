import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:4000";

export default function SeatGrid({ movieId, user }) {
  const [movie, setMovie] = useState(null);
  const [selected, setSelected] = useState([]);
  const socketRef = useRef();
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (!movieId) return;
    let mounted = true;

    axios
      .get(`${API}/api/movies/${movieId}`, { withCredentials: true })
      .then((r) => {
        if (mounted) setMovie(r.data);
      })
      .catch(console.error);

    socketRef.current = io(API, { withCredentials: true });
    socketRef.current.emit("join-movie", { movieId });
    socketRef.current.on("movie:update", (m) => {
      if (m._id === movieId) setMovie(m);
    });

    return () => {
      mounted = false;
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [movieId]);

  const reserveSeats = useCallback(async (seatIds) => {
    if (!seatIds.length) return;
    try {
      await axios.post(
        `${API}/api/reservations/reserve`,
        { movieId, seatIds },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Reserve failed:", err.response?.data || err.message);
    }
  }, [movieId]);

  function toggle(id) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  // Debounced auto-reserve when selected seats change
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!selected.length) return;

    debounceTimer.current = setTimeout(() => {
      reserveSeats(selected);
    }, 500); // debounce delay (ms)
    
    return () => clearTimeout(debounceTimer.current);
  }, [selected, reserveSeats]);

  async function book() {
    if (!selected.length) return alert("Select seats first");
    try {
      await axios.post(
        `${API}/api/reservations/book`,
        { movieId, seatIds: selected },
        { withCredentials: true }
      );
      alert("Booked!");
      setSelected([]);
      const m = await axios.get(`${API}/api/movies/${movieId}`, {
        withCredentials: true,
      });
      setMovie(m.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  async function cancel() {
    if (!selected.length) return alert("Select seats first");
    try {
      await axios.post(
        `${API}/api/reservations/cancel`,
        { movieId, seatIds: selected },
        { withCredentials: true }
      );
      setSelected([]);
      const m = await axios.get(`${API}/api/movies/${movieId}`, {
        withCredentials: true,
      });
      setMovie(m.data);
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  if (!movie) return <div>Loading seats...</div>;

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(8,48px)`,
          gap: 8,
        }}
      >
        {movie.seats.map((s) => {
          const id = s._id;
          const reserved =
            s.isReserved && s.reservedUntil && new Date(s.reservedUntil) > new Date();
          const disabled =
            s.isBooked || (reserved && s.reservedBy && s.reservedBy !== user.id);

          return (
            <button
              key={id}
              disabled={disabled}
              onClick={() => toggle(id)}
              style={{
                background: selected.includes(id)
                  ? "#6cf"
                  : s.isBooked
                  ? "#777"
                  : reserved
                  ? "#fdd"
                  : "#efe",
                height: 40,
                width: 40,
                borderRadius: 6,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {s.row}
              {s.number}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={book}>Book</button>
        <button onClick={cancel} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
