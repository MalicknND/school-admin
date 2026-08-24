import { Badge } from "@/components/ui/badge";

export function ConfiguredBadge({ configured }: { configured?: boolean | undefined }) {
  return configured ? (
    <Badge variant="secondary">Configuré</Badge>
  ) : (
    <Badge variant="outline">Non configuré</Badge>
  );
}
