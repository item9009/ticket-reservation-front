import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import EventListPage from './pages/EventListPage'
import SeatSelectPage from './pages/SeatSelectPage'
import ReservationPage from './pages/ReservationPage'
import ReservationCompletePage from './pages/ReservationCompletePage'
import MyReservationsPage from './pages/MyReservationsPage'
import ReservationDetailPage from './pages/ReservationDetailPage'
import useAuthStore from './store/authStore'

function PrivateRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<EventListPage />} />
                <Route
                  path="/events/:eventId/seats"
                  element={
                    <PrivateRoute>
                      <SeatSelectPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/events/:eventId/confirm"
                  element={
                    <PrivateRoute>
                      <ReservationPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reservation-complete"
                  element={
                    <PrivateRoute>
                      <ReservationCompletePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-reservations"
                  element={
                    <PrivateRoute>
                      <MyReservationsPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-reservations/:reservationNo"
                  element={
                    <PrivateRoute>
                      <ReservationDetailPage />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </>
          }
        />
      </Routes>
    </div>
  )
}
