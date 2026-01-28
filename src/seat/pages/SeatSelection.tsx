import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getSeatsByShow, getShowById } from "../service/seatingService";
import { Show as ShowDTO, SeatDTO } from "../../common/utils/DTOs";
import "./SeatSelection.css";

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [show, setShow] = useState<ShowDTO | null>(null);
  const [seats, setSeats] = useState<SeatDTO[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<SeatDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [requiredSeats, setRequiredSeats] = useState<number>(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningType, setWarningType] = useState<"exceed" | "less">("exceed");

  useEffect(() => {
    if (!showId) return;
    
    // Get required seats from navigation state or localStorage
    const state = location.state as { requiredSeats?: number };
    const required = state?.requiredSeats || parseInt(localStorage.getItem(`requiredSeats_${showId}`) || "0");
    setRequiredSeats(required);
    
    loadShowAndSeats();
  }, [showId]);

  const loadShowAndSeats = async () => {
    try {
      setLoading(true);
      const [showData, seatsData] = await Promise.all([
        getShowById(Number(showId)),
        getSeatsByShow(Number(showId))
      ]);
      setShow(showData);
      setSeats(seatsData);
      setLoading(false);
    } catch (error) {
      console.error("Error loading seats:", error);
      setLoading(false);
    }
  };

  // Group seats by row
  const groupedSeats = seats.reduce((acc, seat) => {
    const row = seat.seatNumber.charAt(0);
    if (!acc[row]) {
      acc[row] = [];
    }
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, SeatDTO[]>);

  const handleSeatClick = (seat: SeatDTO) => {
    if (seat.status === "BOOKED") return;

    const isSelected = selectedSeats.some(s => s.id === seat.id);
    
    if (isSelected) {
      // Deselect seat
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      // Check if we can select more seats
      if (requiredSeats > 0 && selectedSeats.length >= requiredSeats) {
        setWarningMessage(`You can only select ${requiredSeats} ${requiredSeats === 1 ? 'seat' : 'seats'}. Please deselect a seat first.`);
        setWarningType("exceed");
        setShowWarning(true);
        return;
      }
      
      // Select seat
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const getSeatTypeLabel = (seatType: string) => {
    const labels: Record<string, string> = {
      REGULAR: "NORMAL",
      PREMIUM: "PREMIUM",
      RECLINER: "EXECUTIVE"
    };
    return labels[seatType] || seatType;
  };

  const getSeatPrice = (seatType: string) => {
    const prices: Record<string, number> = {
      REGULAR: 260,
      PREMIUM: 300,
      RECLINER: 280
    };
    return prices[seatType] || 0;
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seat) => {
      return total + getSeatPrice(seat.seatType);
    }, 0);
  };

  const handleProceed = () => {
    // Check if correct number of seats selected
    if (requiredSeats > 0 && selectedSeats.length < requiredSeats) {
      setWarningMessage(`Please select ${requiredSeats} ${requiredSeats === 1 ? 'seat' : 'seats'}. You have only selected ${selectedSeats.length}.`);
      setWarningType("less");
      setShowWarning(true);
      return;
    }

    if (selectedSeats.length > 0) {
      // Navigate to booking summary with selected seats
      const seatIds = selectedSeats.map(s => s.id).join(',');
      navigate(`/booking/summary?showId=${showId}&seats=${seatIds}`);
    }
  };

  const closeWarning = () => {
    setShowWarning(false);
  };

  // Helper function to check if we should show seat type divider
  const shouldShowDivider = (row: string, rowSeats: SeatDTO[]) => {
    const sortedRows = Object.keys(groupedSeats).sort((a, b) => b.localeCompare(a));
    const currentIndex = sortedRows.indexOf(row);
    
    if (currentIndex === 0) return true; // Always show for first row
    
    const previousRow = sortedRows[currentIndex - 1];
    const previousRowSeats = groupedSeats[previousRow];
    
    // Show divider if seat type changed from previous row
    return rowSeats[0].seatType !== previousRowSeats[0].seatType;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading seats...</p>
      </div>
    );
  }

  if (!show) {
    return <div className="text-center mt-5">Show not found</div>;
  }

  return (
    <>
      <div className="seat-selection-container">
        {/* Header */}
        <div className="seat-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <div className="show-info">
            <div className="movie-title-header">
              {show.movie?.name} - ({show.movie?.language})
            </div>
            <h5>{show.theatre.name}</h5>
            <p>{show.theatre.location} | {new Date(show.showTime).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} | {new Date(show.showTime).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })}</p>
          </div>
          <div className="ticket-count">
            <span className="ticket-icon">🎫</span>
            {requiredSeats > 0 ? `${selectedSeats.length}/${requiredSeats} Selected` : `${selectedSeats.length} Tickets`}
          </div>
        </div>

        {/* Show Time Tabs */}
        <div className="show-time-tabs">
          <button className="time-tab active">
            {new Date(show.showTime).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true
            })}
          </button>
        </div>

        {/* Screen */}
        <div className="screen-container">
          <div className="screen">SCREEN</div>
        </div>

        {/* Seat Layout */}
        <div className="seat-layout">
          {Object.entries(groupedSeats)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([row, rowSeats]) => {
              const firstSeat = rowSeats[0];
              const seatTypeLabel = getSeatTypeLabel(firstSeat.seatType);
              const seatPrice = getSeatPrice(firstSeat.seatType);
              const showDivider = shouldShowDivider(row, rowSeats);

              return (
                <div key={row} className="seat-row-container">
                  {/* Seat Type Label - Show when seat type changes */}
                  {showDivider && (
                    <div className="seat-type-divider">
                      ₹{seatPrice} {seatTypeLabel}
                    </div>
                  )}

                  <div className="seat-row">
                    <div className="row-label">{row}</div>
                    <div className="seats">
                      {rowSeats
                        .sort((a, b) => {
                          const numA = parseInt(a.seatNumber.slice(1));
                          const numB = parseInt(b.seatNumber.slice(1));
                          return numA - numB;
                        })
                        .map((seat) => {
                          const isSelected = selectedSeats.some(s => s.id === seat.id);
                          const individualSeatPrice = getSeatPrice(seat.seatType);
                          const individualSeatTypeLabel = getSeatTypeLabel(seat.seatType);
                          
                          return (
                            <button
                              key={seat.id}
                              className={`seat ${seat.status.toLowerCase()} ${isSelected ? 'selected' : ''}`}
                              onClick={() => handleSeatClick(seat)}
                              disabled={seat.status === "BOOKED"}
                              data-tooltip={`${seat.seatNumber} | ${individualSeatTypeLabel} | ₹${individualSeatPrice}`}
                              title={`${seat.seatNumber} - ${individualSeatTypeLabel} - ₹${individualSeatPrice}`}
                            >
                              {seat.seatNumber.slice(1)}
                            </button>
                          );
                        })}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Legend */}
        <div className="seat-legend">
          <div className="legend-item">
            <div className="legend-box available-box"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-box selected-box"></div>
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <div className="legend-box sold-box"></div>
            <span>Sold</span>
          </div>
        </div>

        {/* Footer with Proceed Button */}
        {selectedSeats.length > 0 && (
          <div className="seat-footer">
            <div className="footer-content">
              <div className="selected-info">
                <div className="selected-seats-text">
                  {selectedSeats.map(s => s.seatNumber).join(", ")}
                </div>
                <div className="total-price">₹{calculateTotal()}</div>
              </div>
              <button 
                className="proceed-btn"
                onClick={handleProceed}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Warning Modal */}
      {showWarning && (
        <div className="warning-modal-backdrop" onClick={closeWarning}>
          <div className="warning-modal" onClick={(e) => e.stopPropagation()}>
            <div className="warning-icon">
              {warningType === "exceed" ? "⚠️" : "ℹ️"}
            </div>
            <h3>{warningType === "exceed" ? "Seat Limit Reached" : "Incomplete Selection"}</h3>
            <p>{warningMessage}</p>
            <div className="warning-modal-actions">
              {warningType === "exceed" ? (
                <button className="warning-btn warning-btn-ok" onClick={closeWarning}>
                  OK
                </button>
              ) : (
                <>
                  <button className="warning-btn warning-btn-cancel" onClick={closeWarning}>
                    Continue Selecting
                  </button>
                  <button className="warning-btn warning-btn-proceed" onClick={() => {
                    closeWarning();
                    if (selectedSeats.length > 0) {
                      const seatIds = selectedSeats.map(s => s.id).join(',');
                      navigate(`/booking/summary?showId=${showId}&seats=${seatIds}`);
                    }
                  }}>
                    Proceed Anyway
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SeatSelection;
