import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./screenings_modal.scss";

const Modal = ({
  title,
  genre,
  description,
  duration_minutes,
  poster_path,
  screenings,
  screeningsLoading,
  close,
}) => {
  const modalRef = useRef(null);

  if (!modalRef.current) {
    modalRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    modalRoot.appendChild(modalRef.current);

    return () => {
      modalRoot.removeChild(modalRef.current);
    };
  }, []);

  return createPortal(
    <div className="modal-overlay">
      <div className="modal">
        <button
          className="modal-close-button"
          type="button"
          onClick={close}
          aria-label="Close modal"
        >
          X
        </button>

        <div className="modal-poster-frame">
          <img className="modal-poster" src={poster_path} alt={title} />
        </div>

        <div className="movie-info">
          <h1>{title}</h1>
          <p className="movie-duration">
            Duration: {Math.floor(duration_minutes / 60)}h{" "}
            {duration_minutes % 60}m
          </p>
          <p className="movie-genre">{genre}</p>
          <p className="movie-description">{description}</p>
        </div>

        <div className="screenings-info">
          <>
            <h2 className="screenings-title">Screenings</h2>
            <table className="screenings-table">
              <thead className="screenings-table-header">
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
                  <tr className="screenings-table-loading-row">
                    <td colSpan="5" className="screenings-loading">
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
                      <td>
                        <button
                          className="screening-select-button"
                          type="button"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        </div>
      </div>
    </div>,

    modalRef.current,
  );
};

export default Modal;
