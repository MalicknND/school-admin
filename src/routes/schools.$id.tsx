import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { APP_NAME, PORTAL_NAME } from "@/lib/branding";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { ErrorState, LoadingState } from "@/components/layout/StateBlocks";
import { useSchool } from "@/features/schools/hooks";
import { useUsers } from "@/features/users/hooks";
import { fullName, schoolAdminsOfSchool, usersOfSchool } from "@/features/users/derive";
import { ConfiguredBadge } from "@/features/schools/components/SchoolStatusBadges";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/schools/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `Fiche établissement — ${PORTAL_NAME} | ${APP_NAME}` },
      { name: "description", content: "Détail d’un établissement de la plateforme." },
      { property: "og:title", content: `Fiche établissement — ${PORTAL_NAME}` },
      { property: "og:description", content: "Détail d’un établissement de la plateforme." },
    ],
  }),
  component: SchoolDetailPage,
});

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("fr-FR");
}

function SchoolDetailPage() {
  const { id } = Route.useParams();
  const schoolQuery = useSchool(id);
  const usersQuery = useUsers();
  const school = schoolQuery.data;

  const admins = schoolAdminsOfSchool(usersQuery.data, id);
  const schoolUsers = usersOfSchool(usersQuery.data, id);
  const primaryAdmin = admins[0];

  return (
    <PlatformShell
      title={school?.name ?? "Établissement"}
      description="Fiche en lecture seule"
      actions={
        <Button asChild variant="outline" size="sm">
          <Link to="/schools">
            <ArrowLeft className="size-4" />
            Retour
          </Link>
        </Button>
      }
    >
      {schoolQuery.isPending ? <LoadingState /> : null}
      {schoolQuery.isError ? <ErrorState error={schoolQuery.error} /> : null}

      {school ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Identité</CardTitle>
              <CardDescription>Informations administratives de l’établissement.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-border">
              <Row label="Nom" value={school.name} />
              <Row
                label="Code"
                value={<span className="font-mono text-xs">{school.code || "—"}</span>}
              />
              <Row label="Type" value={school.type} />
              <Row label="Email" value={school.email} />
              <Row label="Téléphone" value={school.phone} />
              <Row label="Adresse" value={school.address} />
              <Row
                label="Ville / Région"
                value={[school.city, school.region].filter(Boolean).join(", ")}
              />
              <Row label="Créé le" value={formatDate(school.createdAt)} />
              <Row label="Mis à jour le" value={formatDate(school.updatedAt)} />
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Statut</CardTitle>
                <CardDescription>Lecture seule.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Configuration</span>
                  <ConfiguredBadge configured={school.configured} />
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Gestion du statut à venir : aucun endpoint d’activation/désactivation n’est exposé
                  par l’API.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Comptes administrateurs</CardTitle>
                <CardDescription>Dérivés des comptes utilisateurs de la plateforme.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {usersQuery.isPending ? <LoadingState label="Chargement des comptes…" /> : null}
                {usersQuery.isError ? <ErrorState error={usersQuery.error} /> : null}
                {usersQuery.isSuccess ? (
                  <>
                    <Row
                      label="Administrateur principal"
                      value={
                        primaryAdmin
                          ? `${fullName(primaryAdmin) || primaryAdmin.email} (${primaryAdmin.email})`
                          : school.directorName || ""
                      }
                    />
                    <Row label="Comptes administrateurs" value={admins.length} />
                    <Row label="Utilisateurs rattachés" value={schoolUsers.length} />
                    {primaryAdmin?.passwordChangeRequired ? (
                      <p className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
                        Le mot de passe temporaire n’a pas encore été changé par l’administrateur.
                      </p>
                    ) : null}
                  </>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}
    </PlatformShell>
  );
}
