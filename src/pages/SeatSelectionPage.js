import React from 'react';
import { useParams } from 'react-router-dom';
import SeatGrid from '../components/SeatGrid';

export default function SeatSelectionPage({ user }) {
  const { movieId } = useParams();

  return (
    <div style={{ padding: 20 }}>
      <h2>Seat Selection</h2>
      <SeatGrid movieId={movieId} user={user} />
    </div>
  );
}
