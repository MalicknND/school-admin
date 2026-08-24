export type UserRole = "SUPER_ADMIN" | "DIRECTEUR" | "SECRETAIRE" | "ENSEIGNANT" | string;

export type AuthUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  schoolId?: string;
  teacherId?: string;
  enabled?: boolean;
  passwordChangeRequired?: boolean;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  tokenType?: string;
  expiresAt?: string;
  user: AuthUser;
};
