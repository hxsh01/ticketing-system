import { useParams } from 'react-router-dom';
import SeatGrid from '../components/SeatGrid';
import '../styles/SeatSelectionPage.css';

export default function SeatSelectionPage({ user }) {
  const { movieId } = useParams();

  return (
    <div className="seat-selection-container">
      <div className="flex-center">
        <h2>Select Your Seats, {user?.name || "Guest"}</h2>
      </div>
      <SeatGrid movieId={movieId} user={user} />
      <div className="legend">
        <span><div style={{ width: 16, height: 16, background: 'rgba(166, 231, 146, 1)', borderRadius: 4 }}></div> Available</span>
        <span><div style={{ width: 16, height: 16, background: '#777', borderRadius: 4 }}></div> Booked</span>
        <span><div style={{ width: 16, height: 16, background: 'rgba(10, 159, 234, 1)', borderRadius: 4 }}></div> Selected</span>
        <span><div style={{ width: 16, height: 16, background: 'rgba(197, 128, 128, 1)', borderRadius: 4 }}></div> Reserved <span style={{ fontSize: 8 }}>* these seats might be available in some time</span></span>
      </div>
    </div>
  );
}
