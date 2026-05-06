import { Route, Routes } from "react-router-dom";
// import GuestRoute from "../common/components/GuestRoute";
import BookingHistory from "../booking/pages/BookingHistory";
import BookingSummary from "../booking/pages/BookingSummary";
import MovieDetails from "../movie/pages/MovieDetails";
import MovieList from "../movie/pages/MovieList";
import PaymentPage from "../payment/pages/PaymentPage";
import SeatSelection from "../seat/pages/SeatSelection";
import ShowSelection from "../show/pages/ShowSelection";
// import Login from "./Login";



import Ticket from "../payment/pages/Ticket";
import Home from "./Home";
import Login from "./Login";

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