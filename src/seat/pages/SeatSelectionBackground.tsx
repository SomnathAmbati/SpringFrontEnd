import { useEffect, useState } from "react";
import { getSeatsByShow, getShowById } from "../service/seatingService";
import { Show as ShowDTO, SeatDTO } from "../../common/utils/DTOs";
import "./SeatSelectionBackground.css";

interface SeatSelectionBackgroundProps {
  showId: number;
  requiredSeats: number;
}

const SeatSelectionBackground = ({ showId, requiredSeats }: SeatSelectionBackgroundProps) => {
  const [show, setShow] = useState<ShowDTO | null>(null);
  const [seats, setSeats] = useState<SeatDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShowAndSeats();
  }, [showId]);

  const loadShowAndSeats = async () => {
    try {
      setLoading(true);
      const [showData, seatsData] = await Promise.all([
        getShowById(showId),
        getSeatsByShow(showId)
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

  if (loading) {
    return (
      <div className="seat-background-container">
        <div className="seat-background-loading">
          <div className="background-spinner"></div>
        </div>
      </div>
    );
  }

  if (!show) return null;

  return (
    <div className="seat-background-container">
      {/* Header */}
      <div className="seat-bg-header">
        <div className="show-info-bg">
          <h5>{show.theatre.name}</h5>
          <p>{show.theatre.location} | {new Date(show.showTime).toLocaleString()}</p>
        </div>
        <div className="ticket-count-bg">
          <span className="ticket-icon">🎫</span>
          {requiredSeats > 0 ? `${requiredSeats} ${requiredSeats === 1 ? 'Ticket' : 'Tickets'}` : 'Select Seats'}
        </div>
      </div>

      {/* Show Time Tabs */}
      <div className="show-time-tabs-bg">
        <button className="time-tab-bg active">
          {new Date(show.showTime).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
          })}
        </button>
      </div>

      {/* Screen */}
      <div className="screen-container-bg">
        <div className="screen-bg">SCREEN</div>
      </div>

      {/* Seat Layout */}
      <div className="seat-layout-bg">
        {Object.entries(groupedSeats)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([row, rowSeats]) => {
            const firstSeat = rowSeats[0];
            const seatTypeLabel = getSeatTypeLabel(firstSeat.seatType);
            const seatPrice = getSeatPrice(firstSeat.seatType);

            return (
              <div key={row} className="seat-row-container-bg">
                {/* Seat Type Label */}
                {(row === 'L' || row === 'K' || row === 'E' || row === 'B') && (
                  <div className="seat-type-divider-bg">
                    ₹{seatPrice} {seatTypeLabel}
                  </div>
                )}

                <div className="seat-row-bg">
                  <div className="row-label-bg">{row}</div>
                  <div className="seats-bg">
                    {rowSeats
                      .sort((a, b) => {
                        const numA = parseInt(a.seatNumber.slice(1));
                        const numB = parseInt(b.seatNumber.slice(1));
                        return numA - numB;
                      })
                      .map((seat) => {
                        const isBestseller = seat.seatNumber.match(/[A-Z]([1-7]|10|11)$/);
                        
                        return (
                          <div
                            key={seat.id}
                            className={`seat-bg ${seat.status.toLowerCase()} ${isBestseller ? 'bestseller' : ''}`}
                          >
                            {seat.seatNumber.slice(1)}
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Legend */}
      <div className="seat-legend-bg">
        <div className="legend-item-bg">
          <div className="legend-box-bg bestseller-box-bg">📦</div>
          <span>Bestseller</span>
        </div>
        <div className="legend-item-bg">
          <div className="legend-box-bg available-box-bg"></div>
          <span>Available</span>
        </div>
        <div className="legend-item-bg">
          <div className="legend-box-bg selected-box-bg"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item-bg">
          <div className="legend-box-bg sold-box-bg"></div>
          <span>Sold</span>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionBackground;