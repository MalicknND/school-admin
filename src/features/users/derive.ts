import type { PlatformUser } from "./types";

/**
 * Le Swagger ne fournit pas d'endpoint "utilisateurs d'une école".
 * Les données ci-dessous sont dérivées côté client depuis GET /api/users.
 */

/** Rôle backend correspondant au compte administrateur d'école (SCHOOL_ADMIN). */
export const SCHOOL_ADMIN_ROLES = ["DIRECTEUR", "SCHOOL_ADMIN"];

export function isSchoolAdmin(user: PlatformUser) {
  return SCHOOL_ADMIN_ROLES.includes(String(user.role));
}

export function usersOfSchool(users: PlatformUser[] | undefined, schoolId: string) {
  return (users ?? []).filter((u) => u.schoolId === schoolId);
}

export function schoolAdminsOfSchool(users: PlatformUser[] | undefined, schoolId: string) {
  return usersOfSchool(users, schoolId).filter(isSchoolAdmin);
}

export function primaryAdminBySchool(users: PlatformUser[] | undefined) {
  const map = new Map<string, PlatformUser>();
  for (const user of users ?? []) {
    if (!user.schoolId || !isSchoolAdmin(user)) continue;
    const current = map.get(user.schoolId);
    if (!current) {
      map.set(user.schoolId, user);
      continue;
    }
    const a = current.createdAt ?? "";
    const b = user.createdAt ?? "";
    if (b && (!a || b < a)) map.set(user.schoolId, user);
  }
  return map;
}

export function fullName(user?: Pick<PlatformUser, "firstName" | "lastName"> | null) {
  if (!user) return "";
  return [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
}
