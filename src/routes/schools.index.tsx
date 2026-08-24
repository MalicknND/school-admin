import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { APP_NAME, PORTAL_NAME } from "@/lib/branding";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { EmptyState, ErrorState, LoadingState } from "@/components/layout/StateBlocks";
import { useSchools } from "@/features/schools/hooks";
import { SchoolsTable } from "@/features/schools/components/SchoolsTable";
import { useUsers } from "@/features/users/hooks";
import { primaryAdminBySchool } from "@/features/users/derive";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/schools/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `Établissements — ${PORTAL_NAME} | ${APP_NAME}` },
      { name: "description", content: "Liste des établissements de la plateforme." },
      { property: "og:title", content: `Établissements — ${PORTAL_NAME}` },
      { property: "og:description", content: "Liste des établissements de la plateforme." },
    ],
  }),
  component: SchoolsPage,
});

function SchoolsPage() {
  const schoolsQuery = useSchools();
  const usersQuery = useUsers();
  const [search, setSearch] = useState("");
  const [configuredFilter, setConfiguredFilter] = useState("all");
  const [platformStatusFilter, setPlatformStatusFilter] = useState("all");

  const adminsBySchool = primaryAdminBySchool(usersQuery.data);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (schoolsQuery.data ?? []).filter((school) => {
      const matchTerm =
        !term ||
        [school.name, school.code, school.email, school.city, school.region]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(term));
      const matchConfigured =
        configuredFilter === "all" ||
        (configuredFilter === "configured"
          ? school.configured === true
          : school.configured !== true);
      const matchPlatformStatus =
        platformStatusFilter === "all" || school.platformStatus === platformStatusFilter;
      return matchTerm && matchConfigured && matchPlatformStatus;
    });
  }, [schoolsQuery.data, search, configuredFilter, platformStatusFilter]);

  return (
    <PlatformShell
      title="Établissements"
      description="Gestion des écoles de la plateforme"
      actions={
        <Button asChild size="sm">
          <Link to="/schools/new">Nouvel établissement</Link>
        </Button>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher par nom, code, email, ville…"
            value={search}
            maxLength={100}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={configuredFilter} onValueChange={setConfiguredFilter}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes configurations</SelectItem>
            <SelectItem value="configured">Configuré</SelectItem>
            <SelectItem value="unconfigured">Non configuré</SelectItem>
          </SelectContent>
        </Select>
        <Select value={platformStatusFilter} onValueChange={setPlatformStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="EN_SERVICE">En service</SelectItem>
            <SelectItem value="SUSPENDU">Suspendu</SelectItem>
            <SelectItem value="ARCHIVE">Archivé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {schoolsQuery.isPending ? <LoadingState /> : null}
      {schoolsQuery.isError ? <ErrorState error={schoolsQuery.error} /> : null}
      {schoolsQuery.isSuccess && filtered.length === 0 ? (
        <EmptyState
          title="Aucun établissement trouvé"
          description={
            (schoolsQuery.data ?? []).length === 0
              ? "Créez le premier établissement et son compte administrateur."
              : "Aucun résultat pour ces critères de recherche."
          }
        />
      ) : null}
      {schoolsQuery.isSuccess && filtered.length > 0 ? (
        <>
          <SchoolsTable schools={filtered} adminsBySchool={adminsBySchool} />
          <p className="mt-3 text-xs text-muted-foreground">
            {filtered.length} établissement(s) affiché(s).
          </p>
        </>
      ) : null}
    </PlatformShell>
  );
}
