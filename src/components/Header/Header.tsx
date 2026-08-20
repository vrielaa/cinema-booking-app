import { Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../context/AuthContext";
import "./header.scss";

export default function Header() {
  const { isAuthenticated: isAuth, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (!response.ok) {
      alert("Logout failed. Please try again.");

      return;
    }

    setIsAuthenticated(false);
    await navigate({ to: "/login" });
  };

  return (
    <>
      <header className="header">
        <nav className="header-nav">
          <Link className="logo-link" to="/">
            <div className="logo"></div>
            <h1 className="logo-text">Cinema Booking App</h1>
            <div className="logo logo-bottom"></div>
          </Link>

          <div className="header-auth-links">
            {isAuth ? (
              <button
                className="header-auth-link header-register-link"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link className="header-auth-link" to="/login">
                  Sign in
                </Link>
                <Link
                  className="header-auth-link header-register-link"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>
      <div className="decorator-rectangle left-decorator-rectangle"></div>
      <div className="decorator-rectangle right-decorator-rectangle"></div>
    </>
  );
}
