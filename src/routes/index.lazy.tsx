import { createLazyFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: () => (
    <Navigate
      to="/movies"
      search={{ title: "", genre: null, page: 1 }}
      replace
    />
  ),
});
