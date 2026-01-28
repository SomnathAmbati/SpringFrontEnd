import axios from "axios";
import { Show, SeatDTO } from "../../common/utils/DTOs";

export const getBookingSummaryData = async (
  showId: number,
  seatIds: number[]
): Promise<{ show: Show; seats: SeatDTO[] }> => {

  const [showRes, seatsRes] = await Promise.all([
    axios.get<Show>(`/shows/${showId}`),
    axios.get<SeatDTO[]>(`/seats/by-ids`, {
      params: { ids: seatIds.join(",") }
    })
  ]);

  return {
    show: showRes.data,
    seats: seatsRes.data
  };
};
