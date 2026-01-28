import { MovieDTO as MovieSummary, SeatDTO, Show } from "../../common/utils/DTOs";
import api from "../../common/utils/api";

export const getMovieSummary = async (movieId: number): Promise<MovieSummary> => {
  const res = await api.get<MovieSummary>(`/movies/${movieId}`);
  return res.data;
};

export const getShowsByMovie = async (movieId: number): Promise<Show[]> => {
  const res = await api.get<Show[]>(`/shows`, {
    params: { movieId }
  });
  return res.data;
};
