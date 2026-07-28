import { Link } from "@tanstack/react-router";
import "./header.scss";

export default function Header() {
  return (
    <>
      <header className="header">
        <nav className="header-nav">
          <Link className="logo-link" to="/">
            <div className="logo"></div>
            <h1 className="logo-text">Cinema Booking App</h1>
            <div className="logo logo-bottom"></div>
          </Link>
        </nav>
      </header>
      <div className="decorator-rectangle left-decorator-rectangle"></div>
      <div className="decorator-rectangle right-decorator-rectangle"></div>
    </>
  );
}
