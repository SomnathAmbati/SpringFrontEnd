import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
// import GuestRoute from "../common/components/GuestRoute";
import MovieList from "../movie/pages/MovieList";
import MovieDetails from "../movie/pages/MovieDetails";
import ShowSelection from "../show/pages/ShowSelection";
import SeatSelection from "../seat/pages/SeatSelection";
import BookingSummary from "../booking/pages/BookingSummary";
import PaymentPage from "../payment/pages/PaymentPage";
import BookingHistory from "../booking/pages/BookingHistory";
// import Login from "./Login";

import SeatSelectionBackground from "../seat/pages/SeatSelectionBackground";

import ProtectedRoute from "../common/components/ProtectedRoute";
import { isAuthenticated } from "../common/utils/mockAuth";

import Login from "./Login";
import Home from "./Home";
import Ticket from "../payment/pages/Ticket";

export default function AppRoutes() {
  return ( 
    <Routes>

      {/* PUBLIC / GUEST ACCESS */}
      <Route path="/" element={<Home />} />


      {/* MOCK LOGIN PAGE */}

      <Route path="/movies" element={<MovieList/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/movies/:movieId" element={<MovieDetails />} />
      <Route path="/home" element={<Home/>}/>

      {/* PROTECTED (guest not allowed) */}
      <Route>
        <Route path="/shows/:movieId" element={<ShowSelection />} />
        <Route path="/seats/:showId" element={<SeatSelection />} />
        <Route path="/booking-summary" element={<BookingSummary/>} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/my-bookings" element={<BookingHistory />} />
        <Route path="/ticket" element={<Ticket />} />

      </Route>
    </Routes>
  );
}