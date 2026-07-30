import type { Screening } from "./screening";

declare module "@tanstack/history" {
  interface HistoryState {
    screening?: Screening;
  }
}
