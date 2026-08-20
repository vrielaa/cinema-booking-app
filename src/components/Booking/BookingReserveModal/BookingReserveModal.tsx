import { useEffect, startTransition, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import "./booking_reserve_modal.scss";
import { confirmReservation } from "../../../api";
import type { Screening } from "../../../types/screening";
import type { SeatMap } from "../../../types/booking";
import type { SeatSetter } from "../../../types/booking";

const Modal = ({
  screening,
  selectedSeats,
  setSelectedSeats,
  setTakenSeats,
  addOptimisticTakenSeats,
  setReservationLoading,
  setReservationError,
  closeModal,
  handleBookingError,
}: {
  screening: Screening;
  selectedSeats: SeatMap;
  setSelectedSeats: SeatSetter;
  setTakenSeats: SeatSetter;
  addOptimisticTakenSeats: (newTakenSeats: SeatMap) => void;
  setReservationError: (error: string) => void;
  setReservationLoading: (loading: boolean) => void;
  closeModal: () => void;
  handleBookingError: (error: unknown) => void;
}) => {
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

  async function reserveSeats() {
    const seatsToReserve = { ...selectedSeats };

    setReservationLoading(true);
    setReservationError("");
    closeModal();

    startTransition(async () => {
      addOptimisticTakenSeats(seatsToReserve);

      try {
        await confirmReservation(
          screening.id,
          seatsToReserve,
          setSelectedSeats,
          setTakenSeats,
          setReservationError,
        );
      } catch (error) {
        handleBookingError(error);
      } finally {
        setReservationLoading(false);
      }
    });
  }

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  return createPortal(
    <div className="booking-reserve-overlay" onClick={handleOverlayClick}>
      <div
        className="booking-reserve-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-reserve-title"
      >
        <button
          className="booking-reserve-close-button"
          type="button"
          onClick={closeModal}
          aria-label="Close modal"
        >
          X
        </button>

        <h2 className="booking-reserve-title" id="booking-reserve-title">
          Confirm Reservation
        </h2>
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
          <button
            className="booking-reserve-confirm-button"
            type="submit"
            disabled={Object.keys(selectedSeats).length === 0}
            onClick={reserveSeats}
          >
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>,

    modalElement,
  );
};

export default Modal;
