
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMovies } from "../service/movieService";
import { MovieDTO as Movie } from "../../common/utils/DTOs";
import "./MovieList.css"
const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | "">("");

  // 🔹 ADDED
  const [movieType, setMovieType] =
    useState<"AVAILABLE" | "UPCOMING">("AVAILABLE");

  const navigate = useNavigate();

  const splitByComma = (value: string): string[] =>
    value.split(",").map((v) => v.trim());

  useEffect(() => {
    getAllMovies()
      .then(setMovies)
      .catch((err) => console.error("Error fetching movies", err));
  }, []);

  // 🔹 ADDED
  const today = new Date(2026, 1, 20);

  if (movies.length === 0) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  const genres = Array.from(
    new Set(movies.flatMap((m) => splitByComma(m.genre)))
  );

  const languages = Array.from(
    new Set(movies.flatMap((m) => splitByComma(m.language)))
  );

  const filteredMovies = movies
    // 🔹 ADDED (Available / Upcoming filter)
    .filter((movie) => {
      const releaseDate = new Date(movie.releaseDate);
      releaseDate.setHours(0, 0, 0, 0);

      return movieType === "AVAILABLE"
        ? releaseDate <= today
        : releaseDate > today;
    })
    .filter((movie) =>
      movie.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((movie) => {
      const movieGenres = splitByComma(movie.genre);
      const movieLanguages = splitByComma(movie.language);

      return (
        (!selectedGenre || movieGenres.includes(selectedGenre)) &&
        (!selectedLanguage || movieLanguages.includes(selectedLanguage)) &&
        (selectedRating === "" || movie.averageRating >= selectedRating)
      );
    });

  return (
    <div className="container-fluid mt-3">
      {/* FILTER + SEARCH BAR */}
      <div className="row mb-3">
        <div className="col-12 d-flex flex-wrap justify-content-end gap-3">
          <input
            type="text"
            className="form-control form-control-sm shadow-sm"
            placeholder="🔍 Search movie..."
            style={{ maxWidth: "180px" }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            className="form-select form-select-sm shadow-sm"
            style={{ maxWidth: "160px" }}
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">🎭 All Genres</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm shadow-sm"
            style={{ maxWidth: "160px" }}
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="">🌐 All Languages</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select
            className="form-select form-select-sm shadow-sm"
            style={{ maxWidth: "150px" }}
            value={selectedRating}
            onChange={(e) =>
              setSelectedRating(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">⭐ All Ratings</option>
            <option value="4">4★ & above</option>
            <option value="3">3★ & above</option>
            <option value="2">2★ & above</option>
          </select>
        </div>
      </div>

      {/* 🔹 ADDED BUTTONS */}
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-center gap-3">
          <button
            className={`btn btn-sm ${
              movieType === "AVAILABLE" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setMovieType("AVAILABLE")}
          >
            🎬 Available Movies
          </button>

          <button
            className={`btn btn-sm ${
              movieType === "UPCOMING" ? "btn-dark" : "btn-outline-dark"
            }`}
            onClick={() => setMovieType("UPCOMING")}
          >
            ⏳ Upcoming Movies
          </button>
        </div>
      </div>

      <div className="row mb-2">
        <div className="col-12 text-end">
          <small className="text-muted">
            Showing <strong>{filteredMovies.length}</strong> movie
            {filteredMovies.length !== 1 && "s"} 🎬
          </small>
        </div>
      </div>

      {/* MOVIE GRID */}
      <div className="row">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4"
          >
            <div
              className="card shadow-sm"
              style={{
                height: "260px",
                position: "relative",
                overflow: "hidden",
                cursor: "pointer",
                borderRadius: "10px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget
                  .querySelectorAll(".hover-item")
                  .forEach((el) => {
                    (el as HTMLElement).style.transform = "translateY(0)";
                    (el as HTMLElement).style.opacity = "1";
                  });
                (
                  e.currentTarget.querySelector(".base-title") as HTMLElement
                ).style.opacity = "0";
              }}
              onMouseLeave={(e) => {
                e.currentTarget
                  .querySelectorAll(".hover-item")
                  .forEach((el) => {
                    (el as HTMLElement).style.transform = "translateY(20px)";
                    (el as HTMLElement).style.opacity = "0";
                  });
                (
                  e.currentTarget.querySelector(".base-title") as HTMLElement
                ).style.opacity = "1";
              }}
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              <img
                src={movie.imageUrl}
                className="card-img-top"
                alt={movie.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  inset: 0,
                }}
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.3))",
                }}
              />

              <div
                className="base-title"
                style={{
                  position: "absolute",
                  bottom: "12px",
                  left: "12px",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: "15px",
                  transition: "opacity 0.3s",
                  zIndex: 2,
                }}
              >
                {movie.name}
              </div>

              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  padding: "14px",
                  color: "#fff",
                  zIndex: 3,
                }}
              >
                <h6 className="hover-item" style={hoverStyle(0.1)}>
                  {movie.name}
                </h6>
                <p className="hover-item" style={hoverStyle(0.3)}>
                  {movie.genre}
                </p>
                <p className="hover-item" style={hoverStyle(0.5)}>
                  {movie.language}
                </p>
                <p className="hover-item" style={hoverStyle(0.7)}>
                  ⭐ {movie.averageRating}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const hoverStyle = (delay: number) => ({
  fontSize: "13px",
  marginBottom: "4px",
  transform: "translateY(20px)",
  opacity: 0,
  transition: "all 0.3s ease",
  transitionDelay: `${delay}s`,
});

export default MovieList;









