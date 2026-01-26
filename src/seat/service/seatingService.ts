import api from "../../common/utils/api";
import { SeatDTO, ShowDTO } from "../../common/utils/DTOs";


export const getSeatsByShow = async (showId: number): Promise<SeatDTO[]> => {
  const res = await api.get<SeatDTO[]>(`/seats/${showId}`);
  return res.data;
}

export const getShowById = async (showId: number): Promise<ShowDTO> => {
  const res = await api.get<ShowDTO>(`/shows/${showId}`);
  return res.data;
}