import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export interface RouterContext {
  auth: { isAuthenticated: boolean };
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <div className="app-layout">
        <Header />
        <main className="app-main">
          <Outlet />
        </main>
        <Footer />
        <TanStackRouterDevtools />
        <ReactQueryDevtools />
      </div>
    );
  },
});
