import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Building2, LayoutDashboard, LogOut, Settings, ShieldCheck } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { APP_TAGLINE, PORTAL_NAME } from "@/lib/branding";
import { clearSession, readSession } from "@/lib/session";
import { useAuth } from "@/features/auth/AuthContext";
import { useSignOut } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/schools", label: "Établissements", icon: Building2 },
] as const;

export function PlatformShell({
  title,
  description,
  actions,
  children,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { user, ready, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const signOut = useSignOut();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (!ready) return;
    if (!isAuthenticated) {
      // session absente ou rôle non autorisé : purge + redirection
      if (readSession()) clearSession();
      void navigate({ to: "/login", replace: true });
    }
  }, [ready, isAuthenticated, navigate]);

  if (!ready || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Vérification de la session…</p>
      </div>
    );
  }

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() || "SA";

  return (
    <div className="flex min-h-screen bg-muted/40">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <span className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-sidebar-foreground">{PORTAL_NAME}</p>
            <p className="text-xs text-muted-foreground">{APP_TAGLINE}</p>
          </div>
        </div>
        <Separator />
        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((item) => {
            const active = pathname === item.to || pathname.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <span
            aria-disabled="true"
            className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/60"
          >
            <Settings className="size-4" />
            Paramètres
            <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
              À venir
            </span>
          </span>
        </nav>
        <div className="p-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={() => void signOut()}
          >
            <LogOut className="size-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center gap-3 border-b border-border bg-background px-6 py-3">
          <div className="min-w-0 flex-1">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{PORTAL_NAME}</p>
            <h1 className="truncate text-lg font-semibold text-foreground">{title}</h1>
            {description ? (
              <p className="truncate text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <div className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5">
              <span className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </span>
              <div className="hidden leading-tight sm:block">
                <p className="text-xs font-medium text-foreground">
                  {[user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email}
                </p>
                <p className="text-[11px] text-muted-foreground">SUPER_ADMIN</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => void signOut()}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Déconnexion</span>
            </Button>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
