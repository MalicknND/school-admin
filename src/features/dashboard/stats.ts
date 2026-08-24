import type { School } from "@/features/schools/types";
import type { PlatformUser } from "@/features/users/types";
import { isSchoolAdmin } from "@/features/users/derive";

export type PlatformStats = {
  totalSchools: number;
  configuredSchools: number;
  unconfiguredSchools: number;
  totalUsers: number | null;
  schoolAdmins: number | null;
};

/** Statistiques calculées côté client : le backend n'expose pas d'endpoint de stats. */
export function computePlatformStats(
  schools: School[] | undefined,
  users: PlatformUser[] | undefined | null,
): PlatformStats {
  const list = schools ?? [];
  const configured = list.filter((s) => s.configured === true).length;
  return {
    totalSchools: list.length,
    configuredSchools: configured,
    unconfiguredSchools: list.length - configured,
    totalUsers: users ? users.length : null,
    schoolAdmins: users ? users.filter(isSchoolAdmin).length : null,
  };
}

export function sortByCreatedAtDesc<T extends { createdAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""));
}
