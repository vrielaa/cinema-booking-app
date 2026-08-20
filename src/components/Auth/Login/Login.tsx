import { getRouteApi, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type SubmitEvent } from "react";

import { useAuth } from "../../../context/AuthContext";
import AuthPage from "../AuthPage/AuthPage";

const routeApi = getRouteApi("/login");

export default function Login() {
  const search = routeApi.useSearch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated, setIsAuthenticated } = useAuth();

  const isLoginFormValid = email.trim() !== "" && password !== "";

  const handleLogin = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isLoginFormValid) {
      return;
    }

    setLoginError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed.");
      }

      setIsAuthenticated(true);
    } catch (error) {
      setLoginError(
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: search.redirect || "/" });
    }
  }, [isAuthenticated, navigate, search.redirect]);

  return (
    <AuthPage
      alternateLinkText="Create an account"
      alternatePath="/register"
      alternateText="New to our cinema?"
      description="Sign in to choose your seats and manage your reservations."
      eyebrow="Welcome back"
      title="Sign in"
      redirect={{ redirect: search.redirect }}
    >
      <form className="auth-form" onSubmit={handleLogin}>
        <label className="auth-field" htmlFor="login-email">
          <span className="auth-label">Email address</span>
          <input
            className="auth-input"
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="auth-field" htmlFor="login-password">
          <span className="auth-label">Password</span>
          <input
            className="auth-input"
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {loginError && (
          <p className="auth-form-error" role="alert">
            {loginError}
          </p>
        )}

        <button
          className="auth-submit-button"
          type="submit"
          disabled={!isLoginFormValid || isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </AuthPage>
  );
}
