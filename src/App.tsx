import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth, AuthProvider } from "./context/AuthContext";
import "./styles/global.scss";

// 1. Definiujemy router z domyślnym kontekstem (wymóg TypeScriptu)
const router = createRouter({
  routeTree,
  context: { auth: { isAuthenticated: false } },
});

// Rejestrujemy typy dla pełnego Type Safety w całym projekcie
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

const InnerApp = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return (
      <div className="loading-screen">We are veryfying your session...</div>
    );
  }

  return <RouterProvider router={router} context={{ auth }} />;
};

const App = () => {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
        </AuthProvider>
      </QueryClientProvider>
    </StrictMode>
  );
};

const container: HTMLElement | null = document.getElementById("root");

if (!container) {
  throw new Error("Root container missing in index.html");
}

const root = createRoot(container);
root.render(<App />);
