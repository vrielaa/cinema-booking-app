import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import "./screenings_modal.scss";
import ScreeningsTable from "../ScreeningsTable/ScreeningsTable";
import ScreeningsMovieInfo from "../ScreeningsMovieInfo/ScreeningsMovieInfo";

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
    <div className="screenings-modal-overlay" onClick={handleOverlayClick}>
      <div className="screenings-modal">
        <button
          className="screenings-modal-close-button"
          type="button"
          onClick={close}
          aria-label="Close modal"
        >
          X
        </button>
        <ScreeningsMovieInfo
          title={title}
          genre={genre}
          description={description}
          duration_minutes={duration_minutes}
          poster_path={poster_path}
        />

        <div className="screenings-info">
          <>
            <h2 className="screenings-title">Screenings</h2>
            <ScreeningsTable
              screenings={screenings}
              screeningsLoading={screeningsLoading}
            />
          </>
        </div>
      </div>
    </div>,

    modalRef.current,
  );
};

export default Modal;
