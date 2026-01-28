import { SeatDTO, Show } from "../common/utils/DTOs";

export interface BookingSummaryData {
  show: Show;
  seats: SeatDTO[];
}
