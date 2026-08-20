import AuthPage from "../AuthPage/AuthPage";
import { useState, type SubmitEvent } from "react";
import { getRouteApi } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

const routeApi = getRouteApi("/register");

export default function Register() {
  const search = routeApi.useSearch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordIsTooShort = password.length > 0 && password.length < 8;
  const passwordsDoNotMatch =
    confirmPasswordInput.length > 0 && password !== confirmPasswordInput;
  const isRegistrationFormValid =
    name.trim() !== "" &&
    email.trim() !== "" &&
    password.length >= 8 &&
    password === confirmPasswordInput;

  const handleRegister = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isRegistrationFormValid) {
      return;
    }

    setRegistrationError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed.");
      }

      await navigate({
        to: "/login",
        search: { redirect: search.redirect },
      });
    } catch (error) {
      setRegistrationError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPage
      alternateLinkText="Sign in"
      alternatePath="/login"
      alternateText="Already have an account?"
      description="Create your cinema account before reserving your first seats."
      eyebrow="Join the audience"
      title="Create account"
      redirect={{ redirect: search.redirect }}
    >
      <form className="auth-form" onSubmit={handleRegister}>
        <label className="auth-field" htmlFor="register-name">
          <span className="auth-label">Full name</span>
          <input
            className="auth-input"
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <label className="auth-field" htmlFor="register-email">
          <span className="auth-label">Email address</span>
          <input
            className="auth-input"
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>

        <label className="auth-field" htmlFor="register-password">
          <span className="auth-label">Password</span>
          <input
            className="auth-input"
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            aria-invalid={passwordIsTooShort}
            aria-describedby={
              passwordIsTooShort ? "password-length-error" : undefined
            }
          />

          {passwordIsTooShort && (
            <span
              className="auth-field-error"
              id="password-length-error"
            >
              Password must contain at least 8 characters.
            </span>
          )}
        </label>

        <label className="auth-field" htmlFor="register-password-confirmation">
          <span className="auth-label">Confirm password</span>
          <input
            className="auth-input"
            id="register-password-confirmation"
            type="password"
            value={confirmPasswordInput}
            onChange={(e) => setConfirmPasswordInput(e.target.value)}
            autoComplete="new-password"
            placeholder="Repeat your password"
            aria-invalid={passwordsDoNotMatch}
            aria-describedby={
              passwordsDoNotMatch ? "password-confirmation-error" : undefined
            }
          />

          {passwordsDoNotMatch && (
            <span
              className="auth-field-error"
              id="password-confirmation-error"
            >
              Passwords do not match.
            </span>
          )}
        </label>

        {registrationError && (
          <p className="auth-form-error" role="alert">
            {registrationError}
          </p>
        )}

        <button
          className="auth-submit-button"
          type="submit"
          disabled={!isRegistrationFormValid || isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthPage>
  );
}
