import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMovieById, submitRating } from "../service/movieService";
import { MovieDTO as Movie } from "../../common/utils/DTOs";
import { isLoggedIn } from "../../common/utils/mockAuth";

const MovieDetails = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);
  const navigate = useNavigate();

  const splitByComma = (value: string): string[] =>
  value.split(",").map(v => v.trim());
  
  useEffect(() => {
    if (movieId) {
      getMovieById(Number(movieId)).then(setMovie);
    }
  }, [movieId]);

  const handleRating = async (rating: number) => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
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
    <div className="container mt-4">
      <div className="row">

        <div className="col-md-4 mb-3">
          <img
            src={movie.imageUrl}
            alt={movie.name}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-8">
          <h2>{movie.name}</h2>
          <p className="text-muted">{movie.description}</p>

          <p>
            <strong>Genres:</strong>{" "}
            {splitByComma(movie.genre).join(", ")}
          </p>

          <p>
            <strong>Languages:</strong>{" "}
            {splitByComma(movie.language).join(", ")}
          </p>

          <p>
            <strong>Censor Rating:</strong>{" "}
            {movie.censorRating}
          </p>

          <p>
            <strong>Release Date:</strong>{" "}
            {movie.releaseDate}
          </p>

          <p>⭐ <strong>{movie.averageRating}</strong></p>

          <div className="mt-3 d-flex gap-2 flex-wrap">
            {[1,2,3,4,5].map(r => (
              <button
                key={r}
                className="btn btn-outline-warning btn-sm"
                onClick={() => handleRating(r)}
              >
                {r} ⭐
              </button>
            ))}

            <button
              className="btn btn-primary ms-2"
              onClick={handleBooking}
            >
              🎟️ Book Tickets
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetails;
