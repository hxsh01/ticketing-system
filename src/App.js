import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import SeatSelectionPage from './pages/SeatSelectionPage';

const API = process.env.REACT_APP_BACKEND_URL;

export default function App() {
  const [user, setUser] = useState(null);


  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={setUser} />}
        />
        <Route
          path="/"
          element={user ? <HomePage user={user} /> : <Navigate to="/login" />}
        />
        <Route
          path="/seat-selection/:movieId"
          element={user ? <SeatSelectionPage user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
}
