import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieSummary, getShowsByMovie } from "../service/showService";
import { MovieDTO as MovieSummary, Show } from "../../common/utils/DTOs";
import "./ShowSelection.css";
import SeatCountModal from "../../seat/pages/SeatCountModal";
import SeatSelection from "../../seat/pages/SeatSelection";
import SeatSelectionBackground from "../../seat/pages/SeatSelectionBackground";

// const ShowSelection = () => {
//   const { movieId } = useParams();
//   const navigate = useNavigate();
//   const [movie, setMovie] = useState<MovieSummary | null>(null);
//   const [shows, setShows] = useState<Show[]>([]);

//   useEffect(() => {
//     if (!movieId) return;
//     getMovieSummary(Number(movieId)).then(setMovie);
//     getShowsByMovie(Number(movieId)).then(setShows);
//   }, [movieId]);

//   // Group shows by theatre
//   const groupedShows = shows.reduce((acc, show) => {
//     const theatreId = show.theatre.id;
//     if (!acc[theatreId]) {
//       acc[theatreId] = {
//         theatre: show.theatre,
//         shows: []
//       };
//     }
//     acc[theatreId].shows.push(show);
//     return acc;
//   }, {} as Record<number, { theatre: any; shows: Show[] }>);

//   const handleShowClick = (showId: number) => {
//     navigate(`/seat-count/${showId}`);
//   };

//   if (!movie) return <div className="text-center mt-5">Loading...</div>;

//   return (
//     <div className="container mt-4 mb-4">
//       {/* MOVIE HEADER */}
//       <div className="movie-header-card shadow-sm mb-4">
//         <div className="row align-items-center">
//           <div className="col-md-2 col-sm-3">
//             <img
//               src={movie.imageUrl}
//               alt={movie.name}
//               className="movie-poster"
//             />
//           </div>
//           <div className="col-md-10 col-sm-9">
//             <h2 className="movie-title mb-2">{movie.name}</h2>
//             <div className="movie-details mb-2">
//               <span className="detail-item">{movie.genre}</span>
//               <span className="separator">•</span>
//               <span className="detail-item">{movie.language}</span>
//             </div>
//             <span className="censor-badge">{movie.censorRating}</span>
//             <div className="movie-info-icon">
//               <i className="bi bi-info-circle"></i>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* THEATRE AND SHOW TIMES */}
//       <div className="shows-container">
//         {Object.values(groupedShows).map(({ theatre, shows }) => (
//           <div key={theatre.id} className="theatre-show-row mb-4">
//             <div className="row g-0">
//               {/* THEATRE INFO */}
//               <div className="col-md-4">
//                 <div className="theatre-info-card">
//                   <div className="theatre-icon">
//                     <svg
//                       width="24"
//                       height="24"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
//                       <line x1="2" y1="20" x2="2" y2="20" />
//                     </svg>
//                   </div>
//                   <div className="theatre-details">
//                     <h6 className="theatre-name">{theatre.name}</h6>
//                     <p className="theatre-location">{theatre.location}</p>
//                   </div>
//                   <div className="info-icon">
//                     <i className="bi bi-info-circle-fill"></i>
//                   </div>
//                 </div>
//               </div>

//               {/* SHOW TIMES */}
//               <div className="col-md-7">
//                 <div className="show-times-card">
                // <h6 className="py-2 my-n1 text-secondary fw-normal">
                //   Show Timings
                // </h6>
//                   <div className="show-times-wrapper">
//                     {shows.map((show) => {
//                       const showDate = new Date(show.showTime);
//                       const timeString = showDate.toLocaleTimeString("en-US", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                         hour12: true
//                       });

//                       return (
//                         <button
//                           key={show.id}
//                           className="show-time-btn"
//                           onClick={() => handleShowClick(show.id)}
//                         >
//                           {timeString}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
      
//     </div>
//   );
// };

// export default ShowSelection;

const ShowSelection = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieSummary | null>(null);
  const [shows, setShows] = useState<Show[]>([]);
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [requiredSeats, setRequiredSeats] = useState(0);

  useEffect(() => {
    if (!movieId) return;
    getMovieSummary(Number(movieId)).then(setMovie);
    getShowsByMovie(Number(movieId)).then(setShows);
  }, [movieId]);

  // Group shows by theatre
  const groupedShows = shows.reduce((acc, show) => {
    const theatreId = show.theatre.id;
    if (!acc[theatreId]) {
      acc[theatreId] = {
        theatre: show.theatre,
        shows: []
      };
    }
    acc[theatreId].shows.push(show);
    return acc;
  }, {} as Record<number, { theatre: any; shows: Show[] }>);

  const handleShowClick = (showId: number) => {
    setSelectedShowId(showId);
    setShowModal(true);
  };

  const handleProceedToSeats = (seatCount: number) => {
    setRequiredSeats(seatCount);
    setShowModal(false);
    
    // Store in localStorage as backup
    if (selectedShowId) {
      localStorage.setItem(`requiredSeats_${selectedShowId}`, seatCount.toString());
    }
    
    // Give a small delay for modal to close, then navigate with state
    setTimeout(() => {
      navigate(`/seats/${selectedShowId}`, {
        state: { requiredSeats: seatCount }
      });
    }, 300);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedShowId(null);
  };

  if (!movie) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      {/* Main Show Selection Content */}
      <div className={`show-selection-wrapper ${showModal ? 'modal-open' : ''}`}>
        <div className="container mt-4 mb-5">
          {/* MOVIE HEADER */}
          <div className="movie-header-card shadow-sm mb-4">
            <div className="row align-items-center">
              <div className="col-md-2 col-sm-3">
                <img
                  src={movie.imageUrl}
                  alt={movie.name}
                  className="movie-poster"
                />
              </div>
              <div className="col-md-10 col-sm-9">
                <h2 className="movie-title mb-2">{movie.name}</h2>
                <div className="movie-details mb-2">
                  <span className="detail-item">{movie.genre}</span>
                  <span className="separator">•</span>
                  <span className="detail-item">{movie.language}</span>
                </div>
                <span className="censor-badge">{movie.censorRating}</span>
                <div className="movie-info-icon">
                  <i className="bi bi-info-circle"></i>
                </div>
              </div>
            </div>
          </div>

          {/* THEATRE AND SHOW TIMES */}
          <div className="shows-container">
            {Object.values(groupedShows).map(({ theatre, shows }) => (
              <div key={theatre.id} className="theatre-show-row mb-4">
                <div className="row g-0">
                  {/* THEATRE INFO */}
                  <div className="col-md-4">
                    <div className="theatre-info-card">
                      <div className="theatre-icon">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M2 16.1A5 5 0 0 1 5.9 20M2 12.05A9 9 0 0 1 9.95 20M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />
                          <line x1="2" y1="20" x2="2" y2="20" />
                        </svg>
                      </div>
                      <div className="theatre-details">
                        <h6 className="theatre-name">{theatre.name}</h6>
                        <p className="theatre-location">{theatre.location}</p>
                      </div>
                      <div className="info-icon">
                        <i className="bi bi-info-circle-fill"></i>
                      </div>
                    </div>
                  </div>

                  {/* SHOW TIMES */}
                  <div className="col-md-8">
                    <div className="show-times-card">
                      <h6 className="py-2 my-n1 text-secondary fw-normal">
                        Show Timings
                      </h6>
                      <div className="show-times-wrapper">
                        {shows.map((show) => {
                          const showDate = new Date(show.showTime);
                          const timeString = showDate.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true
                          });

                          return (
                            <button
                              key={show.id}
                              className="show-time-btn"
                              onClick={() => handleShowClick(show.id)}
                            >
                              {timeString}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SEAT SELECTION IN BACKGROUND - Loads when modal opens */}
      {selectedShowId && showModal && (
        <SeatSelectionBackground
          showId={selectedShowId} 
          requiredSeats={requiredSeats}
        />
      )}

      {/* SEAT COUNT MODAL - Appears on top */}
      {showModal && selectedShowId && (
        <SeatCountModal
          showId={selectedShowId}
          movieId={Number(movieId)}
          onClose={handleCloseModal}
          onProceed={handleProceedToSeats}
        />
      )}
    </>
  );
};

export default ShowSelection;
