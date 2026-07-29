import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./booking_reserve_modal.scss";
import { confirmReservation } from "../../../utils/fetchFunctions";
const Modal = ({
  screeningId,
  title,
  date,
  time,
  roomId,
  selectedSeats,
  setSelectedSeats,
  setTakenSeats,
  close,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [reservationLoading, setReservationLoading] = useState(false);
  const [reservationError, setReservationError] = useState("");
  const modalRef = useRef(null);

  if (!modalRef.current) {
    modalRef.current = document.createElement("div");
  }

  useEffect(() => {
    const modalRoot = document.getElementById("modal");
    modalRoot.appendChild(modalRef.current);
    document.body.classList.add("modal-open");

    return () => {
      modalRoot.removeChild(modalRef.current);
      document.body.classList.remove("modal-open");
    };
  }, []);

  function handleOverlayClick(event) {
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
          Movie: <strong>{title}</strong>
        </p>
        <p className="booking-reserve-info">
          Date: <strong>{date}</strong>
        </p>
        <p className="booking-reserve-info">
          Time: <strong>{time}</strong>
        </p>
        <p className="booking-reserve-info">
          Room: <strong> {roomId}</strong>
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
                screeningId,
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

    modalRef.current,
  );
};

export default Modal;
