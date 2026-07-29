import { createLazyFileRoute } from "@tanstack/react-router";

// routes/index.lazy.jsx
import Movies from "../components/Movies/Movies/Movies";

export const Route = createLazyFileRoute("/")({
  component: Movies,
});
