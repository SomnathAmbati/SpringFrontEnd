import { Routes, Route } from "react-router-dom";
import GuestRoute from "../common/components/GuestRoute";
import MovieList from "../movie/pages/MovieList";
import MovieDetails from "../movie/pages/MovieDetails";
import ShowSelection from "../show/pages/ShowSelection";
import SeatSelection from "../seat/pages/SeatSelection";
import BookingSummary from "../booking/pages/BookingSummary";
import PaymentPage from "../payment/pages/PaymentPage";
import BookingHistory from "../booking/pages/BookingHistory";

export default function AppRoutes() {
  return (
    <Routes>

      {/* PUBLIC / GUEST ACCESS */}
      <Route path="/" element={<MovieList />} />
      <Route path="/movies/:movieId" element={<MovieDetails />} />

      {/* MOCK LOGIN PAGE */}
      <Route path="/login" element={<div>Login Page (Mock)</div>} />

      {/* PROTECTED (guest not allowed) */}
      <Route element={<GuestRoute />}>
        <Route path="/shows/:movieId" element={<ShowSelection />} />
        {/* <Route path="/seats/:showId" element={<SeatSelection />} /> */}
        <Route path="/booking/summary" element={<BookingSummary /> } />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-bookings" element={<BookingHistory />} />
      </Route>

    </Routes>
  );
}
