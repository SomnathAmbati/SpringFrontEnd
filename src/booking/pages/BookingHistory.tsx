import { FC, useEffect, useState } from "react";
import api from "../../common/utils/api";
import "./BookingHistory.css";

interface Booking {
  id: number;
  seatNumbers: string;
  totalPrice: number;
  status: string;
  bookingTime: string;
  show: {
    showTime: string;
    movie: {
      name: string;
      imageUrl: string;
    };
    theatre: {
      name: string;
      location: string;
    };
  };
}

const BookingHistory: FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => setError("Failed to load booking history"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading bookings...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-4">{error}</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center mt-5 empty-bookings">
        <h4>No bookings yet 🎟️</h4>
        <p>Book a movie and your tickets will appear here.</p>
      </div>
    );
  }

  return (
    <div className="container booking-history-container mt-4">
      <h3 className="mb-4 text-center fw-bold">🎬 My Bookings</h3>

      <div className="row">
        {bookings.map((booking) => (
          <div className="col-md-6 col-lg-4 mb-4" key={booking.id}>
            <div className="card booking-card h-100 shadow-sm">
              <img
                src={booking.show.movie.imageUrl}
                className="card-img-top booking-movie-img"
                alt={booking.show.movie.name}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  {booking.show.movie.name}
                </h5>

                <p className="text-muted mb-1">
                  🎭 {booking.show.theatre.name},{" "}
                  {booking.show.theatre.location}
                </p>

                <p className="mb-1">
                  🕒{" "}
                  {new Date(booking.show.showTime).toLocaleString([], {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>

                <p className="mb-1">
                  💺 Seats: <b>{booking.seatNumbers}</b>
                </p>

                <p className="mb-1">
                  💰 Amount: <b>₹{booking.totalPrice.toFixed(2)}</b>
                </p>

                <span
                  className={`badge status-badge ${
                    booking.status === "CONFIRMED"
                      ? "bg-success"
                      : "bg-warning"
                  }`}
                >
                  {booking.status}
                </span>

                <div className="mt-auto pt-3">
                  <small className="text-muted">
                    Booking ID: #{booking.id}
                  </small>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;

