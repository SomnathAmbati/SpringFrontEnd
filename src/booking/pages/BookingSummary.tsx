import { FC, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SeatDTO, Show } from "../../common/utils/DTOs";
import "./BookingSummary.css";
import { getBookingSummaryData } from "../service/BookingService";
import api from "../../common/utils/api";

const CONVENIENCE_FEE_PER_TICKET = 30;
const GST_PERCENT = 18;

const BookingSummary:FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const showId = Number(params.get("showId"));
  const seatIds = params.get("seats")?.split(",").map(Number) || [];
  console.log(showId, "  ->  " , seatIds);

  const [show, setShow] = useState<Show | null>(null);
  const [seats, setSeats] = useState<SeatDTO[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!showId || seatIds.length === 0) {
      setError("Invalid booking details");
      return;
    }

    getBookingSummaryData(showId, seatIds)
      .then((data) => {
        setShow(data.show);
        setSeats(data.seats);
      })
      .catch(() => {
        setError("Failed to load booking summary");
      });
  }, []);

  const getSeatPrice = (seatType: string) => {
    return seatType === "PREMIUM" ? 300 : 260;
  };

  const seatTotal = seats.reduce(
    (sum, seat) => sum + getSeatPrice(seat.seatType),
    0
  );

  const convenienceFee = seats.length * CONVENIENCE_FEE_PER_TICKET;
  const gst = ((seatTotal + convenienceFee) * GST_PERCENT) / 100;
  const grandTotal = seatTotal + convenienceFee + gst;

  const handlePay = async () => {
    try {
      const res = await api.post("/bookings", {
        showId,
        seatIds
      });
  
      navigate("/payment", {
        state: {
          bookingId: res.data.id,
          totalAmount: grandTotal
        }
      });
    } catch (err) {
      alert("Failed to create booking");
      console.log(err);
    }
  };
    
  if (error) {
    return <div className="alert alert-danger mt-5 text-center">{error}</div>;
  }

  if (!show) {
    return <div className="text-center mt-5">Loading booking summary...</div>;
  }

  return (
    <div className="container booking-summary-container mt-4">

      {/* 🎟️ TOP CARD */}
      <div className="card booking-info-card mb-3">
        <div className="card-body">
          <h5>{show.movie.name}</h5>
          <p className="text-muted mb-1">
            {new Date(show.showTime).toLocaleDateString()} |
            {" "}
            {new Date(show.showTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
          <p className="mb-1">
            {show.theatre.name} ({show.theatre.location})
          </p>
          <strong>
            Seats: {seats.map(s => s.seatNumber).join(", ")}
          </strong>
        </div>
      </div>

      {/* 💰 PRICE BREAKUP */}
      <div className="card price-card">
        <div className="card-body">
          <div className="price-row">
            <span>Ticket(s) price</span>
            <span>₹{seatTotal.toFixed(2)}</span>
          </div>

          <div className="price-row">
            <span>Convenience fees</span>
            <span>₹{convenienceFee.toFixed(2)}</span>
          </div>

          <div className="price-row">
            <span>GST (18%)</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>

          <hr />

          <div className="price-row total">
            <span>Order total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-danger w-100 mt-3"
            onClick={handlePay}
          >
            Pay ₹{grandTotal.toFixed(2)}
          </button>
        </div>
      </div>

    </div>
  );
};

export default BookingSummary;



