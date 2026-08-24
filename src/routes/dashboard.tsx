import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, CheckCircle2, CircleSlash, ShieldCheck, Users } from "lucide-react";
import { APP_NAME, PORTAL_NAME } from "@/lib/branding";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/layout/StateBlocks";
import { StatCard } from "@/features/dashboard/components/StatCard";
import { usePlatformOverview } from "@/features/dashboard/hooks";
import { SchoolsTable } from "@/features/schools/components/SchoolsTable";
import { primaryAdminBySchool } from "@/features/users/derive";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `Dashboard — ${PORTAL_NAME} | ${APP_NAME}` },
      { name: "description", content: "Vue de synthèse de la plateforme scolaire." },
      { property: "og:title", content: `Dashboard — ${PORTAL_NAME}` },
      { property: "og:description", content: "Vue de synthèse de la plateforme scolaire." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { schoolsQuery, usersQuery, stats, recentSchools } = usePlatformOverview();
  const adminsBySchool = primaryAdminBySchool(usersQuery.data);

  return (
    <PlatformShell
      title="Dashboard plateforme"
      description="Synthèse des établissements et des comptes"
      actions={
        <Button asChild size="sm">
          <Link to="/schools/new">Nouvel établissement</Link>
        </Button>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Établissements" value={stats.totalSchools} icon={Building2} />
        <StatCard label="Configurés" value={stats.configuredSchools} icon={CheckCircle2} />
        <StatCard label="Non configurés" value={stats.unconfiguredSchools} icon={CircleSlash} />
        <StatCard
          label="Comptes utilisateurs"
          value={stats.totalUsers}
          {...(usersQuery.isError ? { hint: "Indisponible" } : {})}
          icon={Users}
        />
        <StatCard
          label="Admins d’école"
          value={stats.schoolAdmins}
          {...(usersQuery.isError ? { hint: "Indisponible" } : {})}
          icon={ShieldCheck}
        />
      </div>

      {usersQuery.isError ? (
        <div className="mt-4">
          <ErrorState error={usersQuery.error} />
        </div>
      ) : null}

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-semibold text-foreground">Derniers établissements</h2>
        {schoolsQuery.isPending ? <LoadingState /> : null}
        {schoolsQuery.isError ? <ErrorState error={schoolsQuery.error} /> : null}
        {schoolsQuery.isSuccess && recentSchools.length === 0 ? (
          <EmptyState
            title="Aucun établissement"
            description="Créez le premier établissement et son compte administrateur."
            action={
              <Button asChild size="sm" className="mt-2">
                <Link to="/schools/new">Créer un établissement</Link>
              </Button>
            }
          />
        ) : null}
        {schoolsQuery.isSuccess && recentSchools.length > 0 ? (
          <SchoolsTable schools={recentSchools} adminsBySchool={adminsBySchool} />
        ) : null}
      </section>
    </PlatformShell>
  );
}
