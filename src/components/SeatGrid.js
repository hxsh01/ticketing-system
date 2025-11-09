import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API = process.env.REACT_APP_BACKEND_URL;

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

    // register the user for private socket notifications
    socketRef.current.emit("register-user", { userId: user.id });

    // join movie room
    socketRef.current.emit("join-movie", { movieId });

    // update movie seats for everyone
    socketRef.current.on("movie:update", (m) => {
      if (m._id === movieId) setMovie(m);
    });

    // notify user when their reservations expire
    socketRef.current.on("reservation:expired", (data) => {
      if (data.movieId !== movieId) return;
      // deselect expired seats from selection
      setSelected((prev) => prev.filter((id) => !data.seatIds.includes(id)));

      // optional small UX improvement
      console.log("Reservation expired for seats:", data.seatIds);
      alert("Oops! Your seat hold expired — seats are now available for others.");
    });

    return () => {
      mounted = false;
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [movieId, user.id]);

  const reserveSeats = useCallback(
    async (seatIds) => {
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
    },
    [movieId]
  );

  function toggle(id) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!selected.length) return;

    debounceTimer.current = setTimeout(() => reserveSeats(selected), 500);
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
      <div className="seat-grid">
        {movie.seats.map((s) => {
          const id = s._id;
          const isReserved =
            s.isReserved && s.reservedUntil && new Date(s.reservedUntil) > new Date();

          const isMine = isReserved && s.reservedBy === user.id;

          const disabled = s.isBooked || (isReserved && !isMine);

          const bg = selected.includes(id)
            ? "rgba(10, 159, 234, 1)" // currently selected
            : s.isBooked
            ? "#777" // booked
            : isMine
            ? "rgba(10, 159, 234, 1)" // reserved by me
            : isReserved
            ? "rgba(197, 128, 128, 1)" // reserved by others
            : "rgba(166, 231, 146, 1)"; // available

          return (
            <button
              key={id}
              disabled={disabled}
              onClick={() => toggle(id)}
              className="seat"
              style={{ background: bg }}
            >
              {s.row}
              {s.number}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button onClick={book}>Book</button>
        <button
          onClick={cancel}
          style={{ marginLeft: 8, backgroundColor: "#e11d48" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
