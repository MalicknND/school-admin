import { Badge } from "@/components/ui/badge";
import type { PlatformStatus } from "../types";

export function ConfiguredBadge({ configured }: { configured?: boolean | undefined }) {
  return configured ? (
    <Badge variant="secondary">Configuré</Badge>
  ) : (
    <Badge variant="outline">Non configuré</Badge>
  );
}

const PLATFORM_STATUS_LABELS: Record<PlatformStatus, string> = {
  EN_SERVICE: "En service",
  SUSPENDU: "Suspendu",
  ARCHIVE: "Archivé",
};

export function PlatformStatusBadge({ status }: { status?: PlatformStatus | undefined }) {
  if (status === "SUSPENDU") {
    return <Badge variant="destructive">{PLATFORM_STATUS_LABELS.SUSPENDU}</Badge>;
  }
  if (status === "ARCHIVE") {
    return <Badge variant="outline">{PLATFORM_STATUS_LABELS.ARCHIVE}</Badge>;
  }
  return <Badge variant="secondary">{PLATFORM_STATUS_LABELS.EN_SERVICE}</Badge>;
}
