import { Link } from "@tanstack/react-router";
import "./screenings_table.scss";
import type { Screening } from "../../../types/screening";

export default function ScreeningsTable({
  screenings,
  screeningsLoading,
}: {
  screenings: Screening[];
  screeningsLoading: boolean;
}) {
  return (
    <table className="screenings-table">
      <thead>
        <tr className="screenings-table-row">
          <th className="screenings-table-header-cell">Date</th>
          <th className="screenings-table-header-cell">Time</th>
          <th className="screenings-table-header-cell">Room</th>
          <th className="screenings-table-header-cell">Seats</th>
          <th className="screenings-table-header-cell"></th>
        </tr>
      </thead>
      <tbody className="screenings-table-body">
        {screeningsLoading ? (
          <tr>
            <td colSpan={5} className="screenings-loading">
              Loading screenings...
            </td>
          </tr>
        ) : (
          screenings.map((screening) => (
            <tr key={screening.id} className="screenings-table-row">
              <td className="screenings-table-cell">
                {screening.screening_date}
              </td>
              <td className="screenings-table-cell">
                {screening.screening_time}
              </td>
              <td className="screenings-table-cell">
                Room #{screening.room_id}
              </td>
              <td className="screenings-table-cell">
                {screening.row_count} x {screening.seats_per_row}
              </td>
              <td className="screenings-table-cell">
                <Link
                  className="screening-select-button"
                  to="/booking/$screeningId"
                  state={{ screening }}
                  params={{ screeningId: String(screening.id) }}
                >
                  Select
                </Link>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
