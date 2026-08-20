import { createLazyFileRoute } from "@tanstack/react-router";
import Register from "../components/Auth/Register/Register";

export const Route = createLazyFileRoute("/register")({
  component: Register,
});
