import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import makeApi from "./api";

export default function SeatGrid({ showId, user, apiBase }) {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);
  const api = makeApi(apiBase);
  const socketRef = useRef();
  const debounceTimer = useRef();

  useEffect(() => {
    if (!showId) return;

    let mounted = true;
    api.getSeats(showId).then((s) => mounted && setSeats(s)).catch(console.error);

    // connect socket
    socketRef.current = io(apiBase);
    socketRef.current.emit("join-show", { showId });

    socketRef.current.on("seats-updated", () => {
      api.getSeats(showId).then(setSeats).catch(console.error);
    });

    return () => {
      mounted = false;
      clearTimeout(debounceTimer.current);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [showId]);

  // 🧠 Debounced reservation logic
  useEffect(() => {
    if (!selected.length) return;

    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(async () => {
      try {
        const res = await api.reserve({
          userId: user._id,
          showId,
          seatIds: selected,
        });
        if (res.error) console.error(res.error);
      } catch (err) {
        console.error("Reserve failed", err);
      }
    }, 500); // 0.5s debounce window
  }, [selected]);

  function toggleSeat(id) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function bookSelected() {
    if (!selected.length) return alert("Select seats first!");
    const res = await api.book({ userId: user._id, showId, seatIds: selected });
    if (res.error) return alert("Could not book: " + res.error);
    alert("Booked successfully!");
    setSelected([]);
    setSeats(await api.getSeats(showId));
  }

  async function cancelSelected() {
    if (!selected.length) return alert("Select seats first!");
    await api.cancel({ userId: user._id, seatIds: selected });
    setSelected([]);
    setSeats(await api.getSeats(showId));
  }

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 48px)",
          gap: 8,
        }}
      >
        {seats.map((s) => {
          const id = s._id;
          const isReserved =
            s.reservedBy &&
            s.reservedUntil &&
            new Date(s.reservedUntil) > new Date();
          const isMine = s.reservedBy === user._id;
          const disabled =
            s.status === "booked" || (isReserved && !isMine);

          return (
            <button
              key={id}
              disabled={disabled}
              onClick={() => toggleSeat(id)}
              style={{
                height: 40,
                width: 40,
                borderRadius: 6,
                background: selected.includes(id)
                  ? "#6cf"
                  : s.status === "booked"
                  ? "#777"
                  : isReserved
                  ? isMine
                    ? "#bdf"
                    : "#fdd"
                  : "#efe",
                opacity: disabled ? 0.6 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {s.row}
              {s.number}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={bookSelected}>Book / Confirm</button>
        <button onClick={cancelSelected} style={{ marginLeft: 8 }}>
          Cancel selected
        </button>
      </div>
    </div>
  );
}
