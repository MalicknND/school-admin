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
