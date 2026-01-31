import { useLocation } from "react-router-dom";
import "./Ticket.css";

const Ticket = () => {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="text-center mt-5">
        <h5>No ticket data found</h5>
      </div>
    );
  }

  return (
    <div className="container ticket-wrapper mt-4">
      <div className="card ticket-card">
        <div className="card-body">

          {/* HEADER */}
          <div className="ticket-header text-center mb-3">
            <h3 className="fw-bold">🎬 I_CINEMA MOVIE TICKET</h3>
            <span className="badge bg-success mt-2">CONFIRMED</span>
          </div>

          <hr />

          {/* MOVIE INFO */}
          <div className="row mb-3">
            <div className="col-md-8">
              <h5 className="movie-name">{state.movieName}</h5>
              <p className="text-muted mb-1">{state.language}</p>
              <p className="mb-1">
                <strong>Theatre:</strong> {state.theatreName}
              </p>
              <p className="mb-1">
                <strong>Location:</strong> {state.theatreLocation}
              </p>
            </div>

            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <div className="booking-id">
                Booking ID
                <div className="fw-bold">#{state.bookingId}</div>
              </div>
            </div>
          </div>

          {/* SHOW DETAILS */}
          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>Show Time:</strong>{" "}
                {new Date(state.showTime).toLocaleString()}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Seats:</strong> {state.seats}
              </p>
            </div>
          </div>

          <hr />

          {/* PAYMENT */}
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0">
                <strong>Booked By:</strong> {state.userName}
              </p>
            </div>
            <div className="col-md-6 text-md-end mt-2 mt-md-0">
              <span className="amount-paid">
                ₹{state.amount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="ticket-actions mt-4 d-print-none">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => window.print()}
            >
              🖨️ Print Ticket
            </button>

            <button
              className="btn btn-primary"
              onClick={() => (window.location.href = "/my-bookings")}
            >
              Go to My Bookings
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Ticket;
