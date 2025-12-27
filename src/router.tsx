import { createRouter } from "@tanstack/react-router";
import { QueryClient, MutationCache } from "@tanstack/react-query";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Toaster } from "sonner";
import { routeTree } from "./routeTree.gen";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotFound } from "./components/NotFound";

export function getRouter() {
  const CONVEX_URL = (import.meta as any).env.VITE_CONVEX_URL;

  if (!CONVEX_URL) {
    console.error("Missing environment variable: VITE_CONVEX_URL");
  }

  const convexClient = new ConvexReactClient(CONVEX_URL || "");
  const convexQueryClient = new ConvexQueryClient(convexClient);

  const queryClient: QueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        queryKeyHashFn: convexQueryClient.hashFn(),
        queryFn: convexQueryClient.queryFn(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
      },
    },
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    }),
  });
  convexQueryClient.connect(queryClient);

  const router = createRouter({
    routeTree,
    defaultPreload: "intent",
    context: { queryClient },
    Wrap: ({ children }) => (
      <ConvexProvider client={convexClient}>
        <ThemeProvider>
          <Toaster
            position="top-right"
            closeButton
            toastOptions={{
              className: 'bg-background border border-border text-foreground',
            }}
          />
          {children}
        </ThemeProvider>
      </ConvexProvider>
    ),
    scrollRestoration: true,
    defaultNotFoundComponent: () => <NotFound />,
  });

  return router;
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
