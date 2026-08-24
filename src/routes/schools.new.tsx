import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { APP_NAME, PORTAL_NAME } from "@/lib/branding";
import { PlatformShell } from "@/components/layout/PlatformShell";
import { CreateSchoolForm } from "@/features/schools/components/CreateSchoolForm";
import { useCreateSchoolWithAdmin } from "@/features/schools/hooks";

export const Route = createFileRoute("/schools/new")({
  ssr: false,
  head: () => ({
    meta: [
      { title: `Nouvel établissement — ${PORTAL_NAME} | ${APP_NAME}` },
      {
        name: "description",
        content: "Créer un établissement et son compte administrateur d’école.",
      },
      { property: "og:title", content: `Nouvel établissement — ${PORTAL_NAME}` },
      {
        property: "og:description",
        content: "Créer un établissement et son compte administrateur d’école.",
      },
    ],
  }),
  component: NewSchoolPage,
});

function NewSchoolPage() {
  const navigate = useNavigate();
  const mutation = useCreateSchoolWithAdmin();

  return (
    <PlatformShell
      title="Nouvel établissement"
      description="Création de l’école et de son compte administrateur"
    >
      <CreateSchoolForm
        isPending={mutation.isPending}
        error={mutation.error}
        onSubmit={(payload) =>
          mutation.mutate(payload, {
            onSuccess: (result) => {
              toast.success("Établissement créé", {
                description:
                  "Le compte administrateur devra changer son mot de passe temporaire à sa première connexion.",
              });
              const id = result?.school?.id;
              if (id) void navigate({ to: "/schools/$id", params: { id } });
              else void navigate({ to: "/schools" });
            },
            onError: (error) => {
              toast.error("Échec de la création", {
                description: error instanceof Error ? error.message : undefined,
              });
            },
          })
        }
      />
    </PlatformShell>
  );
}
