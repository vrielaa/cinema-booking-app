import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import "./auth_page.scss";

type AuthPageProps = {
  alternateLinkText: string;
  alternatePath: "/login" | "/register";
  alternateText: string;
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
  redirect?: { redirect?: string };
};

export default function AuthPage({
  alternateLinkText,
  alternatePath,
  alternateText,
  children,
  description,
  eyebrow,
  title,
  redirect,
}: AuthPageProps) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-card-decoration" aria-hidden="true" />

        <header className="auth-heading">
          <p className="auth-eyebrow">{eyebrow}</p>
          <h2 className="auth-title">{title}</h2>
          <p className="auth-description">{description}</p>
        </header>

        {children}

        <p className="auth-alternate-text">
          {alternateText}{" "}
          <Link
            className="auth-alternate-link"
            to={alternatePath}
            search={redirect}
          >
            {alternateLinkText}
          </Link>
        </p>
      </div>
    </section>
  );
}
