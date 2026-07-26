import { createLazyFileRoute } from "@tanstack/react-router";
import Movies from "../components/Movies/Movies";

export const Route = createLazyFileRoute("/movies")({
  component: Movies,
});
