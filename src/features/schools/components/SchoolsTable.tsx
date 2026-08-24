import { Link } from "@tanstack/react-router";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { School } from "../types";
import type { PlatformUser } from "@/features/users/types";
import { fullName } from "@/features/users/derive";
import { ActiveBadge, ConfiguredBadge } from "./SchoolStatusBadges";

export function SchoolsTable({
  schools,
  adminsBySchool,
}: {
  schools: School[];
  adminsBySchool?: Map<string, PlatformUser>;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Ville / Région</TableHead>
            <TableHead>Configuration</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Administrateur</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map((school) => {
            const admin = adminsBySchool?.get(school.id);
            return (
              <TableRow key={school.id}>
                <TableCell className="font-medium">{school.name}</TableCell>
                <TableCell className="font-mono text-xs">{school.code || "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {[school.city, school.region].filter(Boolean).join(", ") || "—"}
                </TableCell>
                <TableCell>
                  <ConfiguredBadge configured={school.configured} />
                </TableCell>
                <TableCell>
                  <ActiveBadge active={school.active} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {admin ? (
                    <span title={admin.email}>{fullName(admin) || admin.email}</span>
                  ) : (
                    school.directorName || "—"
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/schools/$id" params={{ id: school.id }}>
                      Voir
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
