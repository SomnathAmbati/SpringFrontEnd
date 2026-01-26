import axios from "axios";
import { MovieDTO as Movie } from "../../common/utils/DTOs";
import api from "../../common/utils/api";


export const getAllMovies = async (): Promise<Movie[]> => {
  const res = await api.get<Movie[]>(`/movies`);
  return res.data;
};

export const getMovieById = async (id: number): Promise<Movie> => {
  const res = await api.get<Movie>(`/movies/${id}`);
  return res.data;
};

export const submitRating = async (movieId: number, rating: number) => {
  await api.post(`/movies/${movieId}/rate`, null, {
    params: { rating }
  });
};
