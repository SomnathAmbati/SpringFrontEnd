import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { MovieDTO } from "../common/utils/DTOs";
import { getAllMovies } from "../movie/service/movieService";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const [movies, setMovies] = useState<MovieDTO[]>([]);

  const HandleButtonClick = () => {
    navigate("/movies");
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // 🔹 FETCH MOVIES FROM BACKEND
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getAllMovies();
        setMovies(data);
      } catch (err) {
        console.error("Failed to load movies", err);
      }
    };

    fetchMovies();
  }, []);

  // 🔹 SPLIT MOVIES INTO 4 COLUMNS (same behavior as before)
  const col1 = movies.filter((_, i) => i % 4 === 0);
  const col2 = movies.filter((_, i) => i % 4 === 1);
  const col3 = movies.filter((_, i) => i % 4 === 2);
  const col4 = movies.filter((_, i) => i % 4 === 3);

  return (
    <div className="home-wrapper">

      {/* LEFT AUTO SCROLL */}
      <div className="scroll-column left">
        <div className="scroll-track">
          {col1.concat(col1).map((movie, i) => (
            <img
              key={i}
              src={movie.imageUrl}
              alt={movie.name}
              onClick={HandleButtonClick}
            />
          ))}
        </div>
      </div>

      {/* RIGHT AUTO SCROLL */}
      <div className="scroll-column right">
        <div className="scroll-track reverse">
          {col2.concat(col2).map((movie, i) => (
            <img
              key={i}
              src={movie.imageUrl}
              alt={movie.name}
              onClick={HandleButtonClick}
            />
          ))}
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="center-content">
        <div className="center-card">
          <img
            src="LOGO.png"
            alt="Cinema Logo"
            className="main-logo"
          />

          <h1 className="brand-title">I CINEMA</h1>

          <p className="brand-description">
            Your ticket to a thousand different worlds
          </p>

          <div className="center-actions">
            <button className="primary-btn" onClick={HandleButtonClick}>
              Explore Movies
            </button>
          </div>
        </div>
      </div>

      {/* LEFT AUTO SCROLL */}
      <div className="scroll-column left">
        <div className="scroll-track">
          {col3.concat(col3).map((movie, i) => (
            <img
              key={i}
              src={movie.imageUrl}
              alt={movie.name}
              onClick={HandleButtonClick}
            />
          ))}
        </div>
      </div>

      {/* RIGHT AUTO SCROLL */}
      <div className="scroll-column right">
        <div className="scroll-track reverse">
          {col4.concat(col4).map((movie, i) => (
            <img
              key={i}
              src={movie.imageUrl}
              alt={movie.name}
              onClick={HandleButtonClick}
            />
          ))}
        </div>
      </div>

    </div>
  );
};

export default Home;



