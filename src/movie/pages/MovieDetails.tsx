import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById, submitRating } from "../service/movieService";
import { MovieDTO as Movie } from "../../common/utils/DTOs";
import { isLoggedIn } from "../../common/utils/mockAuth";
import "./MovieDetails.css";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const navigate = useNavigate();

  const splitByComma = (value: string): string[] =>
    value.split(",").map(v => v.trim());
  
  useEffect(() => {
    if (movieId) {
      getMovieById(Number(movieId)).then(setMovie);
    }
  }, [movieId]);

  const handleStarClick = async (rating: number) => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    setSelectedRating(rating);
    await submitRating(Number(movieId), rating);
    alert("Thanks for rating!");
  };

  const handleBooking = () => {
    if (!isLoggedIn()) {
      navigate("/login");
    } else {
      navigate(`/shows/${movieId}`);
    }
  };

  if (!movie) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="movie-details-wrapper">
      <div className="movie-details-container">
        <div className="main-content">

          {/* LEFT: Poster + Rating bubble */}
          <div className="left-section">
            <div className="poster-box">
              <img
                src={movie.imageUrl}
                alt={movie.name}
                className="movie-poster1"
              />
            </div>

            <div className="rating-wrapper">
              <div className="rating-box">
                <div className="star-container">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`star-icon ${
                        star <= (hoveredRating || selectedRating) ? "filled" : ""
                      }`}
                      onClick={() => handleStarClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <div className="rating-tail"></div>
              </div>
              <p className="rate-text">Rate the Movie</p>
            </div>
          </div>

          {/* RIGHT: Details + Book button at bottom */}
          <div className="details-section">
            <h1 className="movie-title">{movie.name}</h1>
            
            <div className="rating-display">
              ⭐ <span>{movie.averageRating.toFixed(1)}</span> / 5.0
            </div>

            <p className="movie-description">{movie.description}</p>

            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Genres:</span>
                <span className="info-content">
                  {splitByComma(movie.genre).map((g, i) => (
                    <span key={i} className="tag">{g}</span>
                  ))}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Languages:</span>
                <span className="info-content">
                  {splitByComma(movie.language).map((l, i) => (
                    <span key={i} className="tag">{l}</span>
                  ))}
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Censor Rating:</span>
                <span className="info-content">
                  <span className="tag">{movie.censorRating}</span>
                </span>
              </div>

              <div className="info-item">
                <span className="info-label">Release Date:</span>
                <span className="info-content">{movie.releaseDate}</span>
              </div>
            </div>

            {/* Book button moved here — inside details-section */}
            <div className="booking-section">
              <button className="book-btn" onClick={handleBooking}>
                🎟️ Book Tickets
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;