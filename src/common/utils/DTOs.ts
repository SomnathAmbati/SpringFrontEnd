import { CensorRating, SeatStatus, SeatType } from "./enum";

export interface TheatreDTO {
  id: number;
  name: string;
  location: string;
}

export interface ShowDTO {
  id: number;
  movieId: number;
  theatre: TheatreDTO;
  showTime: string; // ISO date string
}

export interface SeatDTO {
  id: number;
  seatNumber: string;
  seatType: SeatType;
  status: SeatStatus;
  showId: number;
}

export interface MovieDTO {
  id: number;
  name: string;
  description: string;
  genre: string;
  language: string;
  imageUrl: string;
  releaseDate: string; // ISO date string
  censorRating: CensorRating;
  averageRating: number;
}

export interface Show {
  id: number;
  theatre: TheatreDTO;
  showTime: string;
}