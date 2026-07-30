import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import "./booking_reserve_modal.scss";
import { confirmReservation } from "../../../utils/fetchFunctions";
import type { Screening } from "../../../types/screening";
import type { SeatMap } from "../../../types/booking";
import type { SeatSetter } from "../../../types/booking";

const Modal = ({
  screening,
  selectedSeats,
  setSelectedSeats,
  setTakenSeats,
  close,
}: {
  screening: Screening;
  selectedSeats: SeatMap;
  setSelectedSeats: SeatSetter;
  setTakenSeats: SeatSetter;
  close: () => void;
}) => {
  const [customerName, setCustomerName] = useState("");
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState("");

  const [modalElement] = useState(() => document.createElement("div"));

  useEffect(() => {
    const modalRoot = document.getElementById("modal");

    if (!modalRoot) {
      return;
    }

    modalRoot.appendChild(modalElement);
    document.body.classList.add("modal-open");

    return () => {
      modalRoot.removeChild(modalElement);
      document.body.classList.remove("modal-open");
    };
  }, [modalElement]);

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  return createPortal(
    <div className="booking-reserve-overlay" onClick={handleOverlayClick}>
      <div className="booking-reserve-modal">
        <button
          className="booking-reserve-close-button"
          type="button"
          onClick={close}
          aria-label="Close modal"
        >
          X
        </button>

        <h2 className="booking-reserve-title">Confirm Reservation</h2>
        <p className="booking-reserve-info">
          Movie: <strong>{screening.movie_title}</strong>
        </p>
        <p className="booking-reserve-info">
          Date: <strong>{screening.screening_date}</strong>
        </p>
        <p className="booking-reserve-info">
          Time: <strong>{screening.screening_time}</strong>
        </p>
        <p className="booking-reserve-info">
          Room: <strong> {screening.room_id}</strong>
        </p>
        <p className="booking-reserve-info">
          Seats:{" "}
          <strong>
            {Object.keys(selectedSeats).length > 0
              ? Object.keys(selectedSeats).join(", ")
              : "None selected"}
          </strong>
        </p>

        <div className="booking-reserve-actions">
          {reservationError ? (
            <p className="booking-reserve-error" role="alert">
              {reservationError}
            </p>
          ) : null}
          <input
            className="booking-reserve-name-input"
            type="text"
            placeholder="Enter your name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <button
            className="booking-reserve-confirm-button"
            type="submit"
            disabled={
              !customerName.trim() ||
              reservationLoading ||
              Object.keys(selectedSeats).length === 0
            }
            onClick={() => {
              confirmReservation(
                screening.id,
                customerName,
                selectedSeats,
                setSelectedSeats,
                close,
                setTakenSeats,
                setReservationLoading,
                setReservationError,
              );
            }}
          >
            {reservationLoading ? "Reserving..." : "Confirm Reservation"}
          </button>
        </div>
      </div>
    </div>,

    modalElement,
  );
};

export default Modal;
