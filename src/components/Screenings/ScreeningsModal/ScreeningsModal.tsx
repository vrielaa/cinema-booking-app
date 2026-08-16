import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import "./screenings_modal.scss";
import ScreeningsTable from "../ScreeningsTable/ScreeningsTable";
import ScreeningsMovieInfo from "../ScreeningsMovieInfo/ScreeningsMovieInfo";
import type { Movie } from "../../../types/movie";
import type { Screening } from "../../../types/screening";

const Modal = ({
  focusedMovie,
  screenings,
  screeningsLoading,
  close,
}: {
  focusedMovie: Movie;
  screenings: Screening[];
  screeningsLoading: boolean;
  close: () => void;
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

  function handleOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      close();
    }
  }

  return createPortal(
    <div className="screenings-modal-overlay" onClick={handleOverlayClick}>
      <div
        className="screenings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="screenings-modal-title"
      >
        <button
          className="screenings-modal-close-button"
          type="button"
          onClick={close}
          aria-label="Close modal"
        >
          X
        </button>
        <ScreeningsMovieInfo movie={focusedMovie} />

        <div className="screenings-info">
          <>
            <h2 className="screenings-title" id="screenings-modal-title">
              Screenings
            </h2>
            <ScreeningsTable
              screenings={screenings}
              screeningsLoading={screeningsLoading}
            />
          </>
        </div>
      </div>
    </div>,

    modalElement,
  );
};

export default Modal;
