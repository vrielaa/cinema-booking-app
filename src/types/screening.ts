import type { Dispatch, SetStateAction } from "react";

export type Screening = {
  id: number;
  movie_id: number;
  room_id: number;
  screening_date: string;
  screening_time: string;
  row_count: number;
  seats_per_row: number;
  movie_title: string;
};

export type ScreeningSetter = Dispatch<SetStateAction<Screening | null>>;

export type ScreeningsSetter = Dispatch<SetStateAction<Screening[]>>;
