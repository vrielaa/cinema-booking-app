// routes/register.tsx (lub auth.register.tsx w zależności od twojej struktury)
import { createFileRoute } from "@tanstack/react-router";

export interface RegisterSearch {
  redirect?: string;
}

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): RegisterSearch => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
});
