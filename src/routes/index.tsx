import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { APP_NAME, APP_TAGLINE, PORTAL_NAME } from "@/lib/branding";
import { useAuth } from "@/features/auth/AuthContext";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `${PORTAL_NAME} — ${APP_NAME}` },
      { name: "description", content: APP_TAGLINE },
      { property: "og:title", content: `${PORTAL_NAME} — ${APP_NAME}` },
      { property: "og:description", content: APP_TAGLINE },
    ],
  }),
  component: IndexRedirect,
});

function IndexRedirect() {
  const { ready, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return;
    void navigate({ to: isAuthenticated ? "/dashboard" : "/login", replace: true });
  }, [ready, isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Redirection…</p>
    </div>
  );
}
