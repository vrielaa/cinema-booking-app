import type { Dispatch, SetStateAction } from "react";

export type SeatMap = {
  [seatId: string]: boolean;
};

export type SeatSetter = Dispatch<SetStateAction<SeatMap>>;

export type BookingSeatProps = {
  rowLabel: string;
  seatNumber: number;
  selectedSeats: SeatMap;
  takenSeats: SeatMap;
  setSelectedSeats: SeatSetter;
};
