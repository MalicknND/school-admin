import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { APP_NAME, PORTAL_NAME } from "@/lib/branding";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { ErrorState, LoadingState } from "@/components/layout/StateBlocks";
import { useHardDeleteSchool, useSchool, useUpdatePlatformStatus } from "@/features/schools/hooks";
import type { PlatformStatus } from "@/features/schools/types";
import { useResetPassword, useUsers } from "@/features/users/hooks";
import type { ResetPasswordResult } from "@/features/users/types";
import { fullName, schoolAdminsOfSchool, usersOfSchool } from "@/features/users/derive";
import {
  ConfiguredBadge,
  PlatformStatusBadge,
} from "@/features/schools/components/SchoolStatusBadges";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const HARD_DELETE_CONFIRM_WORD = "SUPPRIMER";

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

const PLATFORM_STATUS_ACTION_LABELS: Record<PlatformStatus, string> = {
  EN_SERVICE: "Mettre en service",
  SUSPENDU: "Suspendre",
  ARCHIVE: "Archiver",
};

function SchoolDetailPage() {
  const { id } = Route.useParams();
  const schoolQuery = useSchool(id);
  const usersQuery = useUsers();
  const school = schoolQuery.data;

  const admins = schoolAdminsOfSchool(usersQuery.data, id);
  const schoolUsers = usersOfSchool(usersQuery.data, id);
  const primaryAdmin = admins[0];

  const navigate = useNavigate();
  const statusMutation = useUpdatePlatformStatus();
  const resetPasswordMutation = useResetPassword();
  const hardDeleteMutation = useHardDeleteSchool();
  const [revealedPassword, setRevealedPassword] = useState<ResetPasswordResult | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [forceAcknowledged, setForceAcknowledged] = useState(false);

  function handleStatusChange(platformStatus: PlatformStatus) {
    statusMutation.mutate(
      { id, platformStatus },
      {
        onSuccess: () => toast.success("Statut plateforme mis à jour"),
        onError: (error) =>
          toast.error("Échec de la mise à jour du statut", {
            description: error instanceof Error ? error.message : undefined,
          }),
      },
    );
  }

  function handleResetPassword() {
    if (!primaryAdmin) return;
    resetPasswordMutation.mutate(primaryAdmin.id, {
      onSuccess: (result) => setRevealedPassword(result),
      onError: (error) =>
        toast.error("Échec de la réinitialisation", {
          description: error instanceof Error ? error.message : undefined,
        }),
    });
  }

  function handleDeleteDialogOpenChange(open: boolean) {
    setDeleteDialogOpen(open);
    if (!open) {
      setDeleteConfirmText("");
      setForceAcknowledged(false);
    }
  }

  function handleHardDelete() {
    if (!school) return;
    hardDeleteMutation.mutate(
      school.configured ? { id: school.id, force: true } : { id: school.id },
      {
        onSuccess: (summary) => {
          toast.success("Établissement supprimé définitivement", {
            description: summary
              ? `${summary.usersDeleted} compte(s), ${summary.studentsDeleted} élève(s), ${summary.classroomsDeleted} classe(s) et toutes leurs données liées ont été supprimés.`
              : undefined,
          });
          void navigate({ to: "/schools" });
        },
        onError: (error) =>
          toast.error("Échec de la suppression", {
            description: error instanceof Error ? error.message : undefined,
          }),
      },
    );
  }

  const hardDeleteDisabled =
    deleteConfirmText !== HARD_DELETE_CONFIRM_WORD ||
    (school?.configured === true && !forceAcknowledged) ||
    hardDeleteMutation.isPending;

  async function copyTemporaryPassword() {
    if (!revealedPassword) return;
    try {
      if (!navigator.clipboard) throw new Error("Presse-papiers indisponible");
      await navigator.clipboard.writeText(revealedPassword.temporaryPassword);
      toast.success("Mot de passe copié");
    } catch {
      toast.error(
        "Impossible de copier automatiquement — sélectionnez le mot de passe manuellement",
      );
    }
  }

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
                <CardDescription>
                  Configuration et statut plateforme de l’établissement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Configuration</span>
                  <ConfiguredBadge configured={school.configured} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Statut plateforme</span>
                  <PlatformStatusBadge status={school.platformStatus} />
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  {school.platformStatus !== "EN_SERVICE" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={statusMutation.isPending}
                      onClick={() => handleStatusChange("EN_SERVICE")}
                    >
                      {PLATFORM_STATUS_ACTION_LABELS.EN_SERVICE}
                    </Button>
                  ) : null}
                  {school.platformStatus !== "SUSPENDU" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" disabled={statusMutation.isPending}>
                          {PLATFORM_STATUS_ACTION_LABELS.SUSPENDU}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Suspendre cet établissement ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Les utilisateurs de cette école ne pourront plus se connecter.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleStatusChange("SUSPENDU")}>
                            Confirmer la suspension
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : null}
                  {school.platformStatus !== "ARCHIVE" ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline" disabled={statusMutation.isPending}>
                          {PLATFORM_STATUS_ACTION_LABELS.ARCHIVE}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Archiver cet établissement ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Les utilisateurs de cette école ne pourront plus se connecter.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleStatusChange("ARCHIVE")}>
                            Confirmer l’archivage
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Comptes administrateurs</CardTitle>
                <CardDescription>
                  Dérivés des comptes utilisateurs de la plateforme.
                </CardDescription>
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
                    {primaryAdmin ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={resetPasswordMutation.isPending}
                          >
                            Réinitialiser le mot de passe
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Réinitialiser le mot de passe ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Un nouveau mot de passe temporaire sera généré pour{" "}
                              {fullName(primaryAdmin) || primaryAdmin.email}. L’administrateur devra
                              le changer à sa prochaine connexion.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={handleResetPassword}>
                              Confirmer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : null}
                  </>
                ) : null}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : null}

      {school ? (
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base text-destructive">Zone de danger</CardTitle>
            <CardDescription>
              Suppression définitive et irréversible de cet établissement.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogOpenChange}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  Supprimer définitivement
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Supprimer définitivement {school.name} ?</AlertDialogTitle>
                  <AlertDialogDescription asChild>
                    <div className="space-y-3 text-left">
                      <p>
                        Cette action supprime définitivement l’établissement ainsi que ses
                        utilisateurs, années scolaires, classes, élèves, notes, présences,
                        bulletins, documents générés et tous les autres éléments qui lui sont
                        rattachés. Cette action est irréversible.
                      </p>
                      {school.configured ? (
                        <p className="font-medium text-destructive">
                          Cet établissement est configuré (onboarding terminé) : la suppression doit
                          être forcée explicitement.
                        </p>
                      ) : null}
                    </div>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="hard-delete-confirm">
                      Tapez {HARD_DELETE_CONFIRM_WORD} pour confirmer
                    </Label>
                    <Input
                      id="hard-delete-confirm"
                      value={deleteConfirmText}
                      onChange={(event) => setDeleteConfirmText(event.target.value)}
                      autoComplete="off"
                    />
                  </div>
                  {school.configured ? (
                    <div className="flex items-start gap-2">
                      <Checkbox
                        id="hard-delete-force"
                        checked={forceAcknowledged}
                        onCheckedChange={(checked) => setForceAcknowledged(checked === true)}
                      />
                      <Label htmlFor="hard-delete-force" className="font-normal leading-snug">
                        Je comprends que cette école est configurée et que la suppression sera
                        forcée
                      </Label>
                    </div>
                  ) : null}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={hardDeleteDisabled}
                    onClick={handleHardDelete}
                    className={buttonVariants({ variant: "destructive" })}
                  >
                    Confirmer la suppression définitive
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      ) : null}

      <Dialog
        open={revealedPassword !== null}
        onOpenChange={(open) => !open && setRevealedPassword(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mot de passe temporaire</DialogTitle>
            <DialogDescription>
              Ce mot de passe ne sera plus jamais affiché après la fermeture de cette fenêtre.
              Communiquez-le à{" "}
              {revealedPassword
                ? fullName(revealedPassword.user) || revealedPassword.user.email
                : "l’administrateur"}
              .
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 rounded-md bg-muted p-3 font-mono text-sm">
            <span className="flex-1 break-all">{revealedPassword?.temporaryPassword}</span>
            <Button size="sm" variant="outline" onClick={copyTemporaryPassword}>
              <Copy className="size-4" />
              Copier
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PlatformShell>
  );
}
