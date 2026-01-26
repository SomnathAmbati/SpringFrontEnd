import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllMovies } from "../service/movieService";
import { MovieDTO as Movie } from "../../common/utils/DTOs";

const MovieList = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const navigate = useNavigate();
  
  const splitByComma = (value: string): string[] =>
  value.split(",").map(v => v.trim());


  useEffect(() => {
    console.log("Fetching movies...");
    getAllMovies().then(setMovies).catch(err => {
      console.error("Error fetching movies:", err);
    });
  }, []);

  // extract unique genres & languages
  if(movies.length === 0) {
    return <div className="text-center mt-5">Loading...</div>;
  }
  const genres = Array.from(
    new Set(movies.flatMap(m => splitByComma(m.genre)))
  );

  const languages = Array.from(
    new Set(movies.flatMap(m => splitByComma(m.language)))
  );

  const filteredMovies = movies.filter(movie => {
    const movieGenres = splitByComma(movie.genre);
    const movieLanguages = splitByComma(movie.language);

    return (
      (!selectedGenre || movieGenres.includes(selectedGenre)) &&
      (!selectedLanguage || movieLanguages.includes(selectedLanguage))
    );
  });

  return (
    <div className="container mt-4">

      {/* FILTERS */}
      <div className="row mb-4">
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={selectedGenre}
            onChange={e => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={selectedLanguage}
            onChange={e => setSelectedLanguage(e.target.value)}
          >
            <option value="">All Languages</option>
            {languages.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
      </div>

      {/* MOVIE GRID */}
      <div className="row">
        {filteredMovies.map(movie => (
          <div
            key={movie.id}
            className="col-lg-3 col-md-4 col-sm-6 mb-4"
          >
            <div
              className="card h-100 shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              <img
                src={movie.imageUrl}
                className="card-img-top"
                alt={movie.name}
                style={{ height: "280px", objectFit: "cover" }}
              />
              <div className="card-body">
                <h6 className="card-title">{movie.name}</h6>
                <p className="card-text text-muted small">
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

export default MovieList;
