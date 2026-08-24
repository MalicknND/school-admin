import type { UserRole } from "@/features/auth/types";

export type PlatformUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  enabled?: boolean;
  passwordChangeRequired?: boolean;
  schoolId?: string;
  schoolName?: string;
  createdAt?: string;
  updatedAt?: string;
};

/** Réservé SUPER_ADMIN : le mot de passe temporaire n'est renvoyé qu'une seule fois. */
export type ResetPasswordResult = {
  user: PlatformUser;
  temporaryPassword: string;
};
