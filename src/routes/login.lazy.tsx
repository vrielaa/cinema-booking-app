import { createLazyFileRoute } from "@tanstack/react-router";
import Login from "../components/Auth/Login/Login";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});
