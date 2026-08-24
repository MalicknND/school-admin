import { Badge } from "@/components/ui/badge";

export function ConfiguredBadge({ configured }: { configured?: boolean | undefined }) {
  return configured ? (
    <Badge variant="secondary">Configuré</Badge>
  ) : (
    <Badge variant="outline">Non configuré</Badge>
  );
}

export function ActiveBadge({ active }: { active?: boolean | undefined }) {
  if (active === undefined || active === null) return <span className="text-muted-foreground">—</span>;
  return active ? <Badge>Actif</Badge> : <Badge variant="destructive">Inactif</Badge>;
}
