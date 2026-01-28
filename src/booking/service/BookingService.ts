import { Show, SeatDTO } from "../../common/utils/DTOs";
import api from "../../common/utils/api";

export const getBookingSummaryData = async (
  showId: number,
  seatIds: number[]
): Promise<{ show: Show; seats: SeatDTO[] }> => {

  const [showRes, seatsRes] = await Promise.all([
    api.get<Show>(`/shows/${showId}`),
    api.get<SeatDTO[]>(`/seats/by-ids`, {
      params: { ids: seatIds.join(",") }
    })
  ]);

  return {
    show: showRes.data,
    seats: seatsRes.data
  };
};