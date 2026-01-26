import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSeatsByShow } from "../service/seatingService";
import { SeatDTO } from "../../common/utils/DTOs";
import "./SeatCountModal.css";

interface SeatCountModalProps {
  showId: number;
  movieId: number;
  onClose: () => void;
  onProceed: (seatCount: number) => void;
}

const SeatCountModal = ({ showId, movieId, onClose, onProceed }: SeatCountModalProps) => {
  const navigate = useNavigate();
  const [seatCount, setSeatCount] = useState("");
  const [seats, setSeats] = useState<SeatDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [availableSeatsCount, setAvailableSeatsCount] = useState(0);

  useEffect(() => {
    loadSeats();
  }, [showId]);

  const loadSeats = async () => {
    try {
      setLoading(true);
      setError(null);
      const seatsData = await getSeatsByShow(showId);
      setSeats(seatsData);
      
      // Count available seats
      const available = seatsData.filter(seat => seat.status === "AVAILABLE").length;
      setAvailableSeatsCount(available);
      
      // Check if all seats are booked
      if (available === 0) {
        setError("All seats are booked for this show. Please select another show time.");
      }
      
      setLoading(false);
    } catch (err) {
      setError("Failed to load seat information. Please try again.");
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === "" || /^[0-9]+$/.test(value)) {
      setSeatCount(value);
      setError(null);
    }
  };

  const handleProceed = () => {
    const count = parseInt(seatCount);
    
    // Validation
    if (!seatCount || count < 1) {
      setError("Please enter a valid number of seats");
      return;
    }
    
    if (count > availableSeatsCount) {
      setError("Required number of seats are not available");
      return;
    }
    
    onProceed(count);
  };

  const handleBookOtherShow = () => {
    navigate(`/movies/${movieId}`);
  };

  const getSeatTypeStats = () => {
    const stats = {
      REGULAR: { available: 0, total: 0, price: 260 },
      RECLINER: { available: 0, total: 0, price: 280 },
      PREMIUM: { available: 0, total: 0, price: 300 }
    };

    seats.forEach(seat => {
      if (seat.seatType in stats) {
        stats[seat.seatType as keyof typeof stats].total++;
        if (seat.status === "AVAILABLE") {
          stats[seat.seatType as keyof typeof stats].available++;
        }
      }
    });

    return stats;
  };

  const seatTypeStats = getSeatTypeStats();

  const getSeatStatus = (available: number, total: number) => {
    if (available === 0) return { text: "SOLD OUT", class: "sold-out" };
    if (available <= total * 0.2) return { text: "ALMOST FULL", class: "almost-full" };
    if (available <= total * 0.5) return { text: "FILLING FAST", class: "filling" };
    return { text: "AVAILABLE", class: "available" };
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop" onClick={onClose}></div>

      {/* Modal */}
      <div className="seat-count-modal">
        {loading ? (
          <div className="loading-state">
            <div className="spinner-small"></div>
            <p>Loading seat information...</p>
          </div>
        ) : (
          <>
            <h3 className="modal-title">How many seats?</h3>

            {/* Scooter Icon */}
            {/* <div className="scooter-icon">
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                <path d="M30 35 L75 35 L80 25 L85 25 L90 35 L90 45 L30 45 Z" fill="#FDB714" stroke="#333" strokeWidth="2"/>
                <rect x="35" y="20" width="25" height="8" rx="4" fill="#F59E0B" stroke="#333" strokeWidth="1.5"/>
                <circle cx="87" cy="30" r="4" fill="#FFE082" stroke="#333" strokeWidth="1.5"/>
                <path d="M85 25 L85 15 L82 12" stroke="#333" strokeWidth="2" fill="none" strokeLinecap="round"/>
                <circle cx="82" cy="12" r="2.5" fill="#666"/>
                <circle cx="82" cy="55" r="12" fill="#22D3EE" stroke="#333" strokeWidth="2.5"/>
                <circle cx="82" cy="55" r="6" fill="white" stroke="#333" strokeWidth="1.5"/>
                <circle cx="38" cy="55" r="12" fill="#22D3EE" stroke="#333" strokeWidth="2.5"/>
                <circle cx="38" cy="55" r="6" fill="white" stroke="#333" strokeWidth="1.5"/>
                <path d="M60 45 L60 52" stroke="#666" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div> */}

            {/* Input Box for Seat Count */}
            <div className="seat-input-container">
              <label htmlFor="seatCount" className="input-label">
                Enter number of seats
              </label>
              <input
                type="text"
                id="seatCount"
                className="seat-input"
                value={seatCount}
                onChange={handleInputChange}
                placeholder="Enter number"
                maxLength={2}
                disabled={availableSeatsCount === 0}
              />
              <div className="available-info">
                {availableSeatsCount} seats available
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {/* Seat Type Pricing */}
            {availableSeatsCount > 0 && (
              <div className="seat-pricing">
                <div className="price-card">
                  <div className="price-label">NORMAL</div>
                  <div className="price-amount">₹{seatTypeStats.REGULAR.price}</div>
                  <div className={`price-status ${getSeatStatus(seatTypeStats.REGULAR.available, seatTypeStats.REGULAR.total).class}`}>
                    {getSeatStatus(seatTypeStats.REGULAR.available, seatTypeStats.REGULAR.total).text}
                  </div>
                </div>
                <div className="price-card">
                  <div className="price-label">EXECUTIVE</div>
                  <div className="price-amount">₹{seatTypeStats.RECLINER.price}</div>
                  <div className={`price-status ${getSeatStatus(seatTypeStats.RECLINER.available, seatTypeStats.RECLINER.total).class}`}>
                    {getSeatStatus(seatTypeStats.RECLINER.available, seatTypeStats.RECLINER.total).text}
                  </div>
                </div>
                <div className="price-card">
                  <div className="price-label">PREMIUM</div>
                  <div className="price-amount">₹{seatTypeStats.PREMIUM.price}</div>
                  <div className={`price-status ${getSeatStatus(seatTypeStats.PREMIUM.available, seatTypeStats.PREMIUM.total).class}`}>
                    {getSeatStatus(seatTypeStats.PREMIUM.available, seatTypeStats.PREMIUM.total).text}
                  </div>
                </div>
              </div>
            )}

            {/* Bestseller Note - Only if seats available */}
            {availableSeatsCount > 0 && (
              <div className="bestseller-note">
                Book the 📦 Bestseller Seats in this cinema at no extra cost!
              </div>
            )}

            {/* Action Buttons */}
            {availableSeatsCount === 0 || (error && parseInt(seatCount) > availableSeatsCount) ? (
              <button className="book-other-show-btn" onClick={handleBookOtherShow}>
                Book Some Other Show
              </button>
            ) : (
              <button 
                className="select-seats-btn" 
                onClick={handleProceed}
                disabled={!seatCount || parseInt(seatCount) < 1}
              >
                Select Seats
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default SeatCountModal;