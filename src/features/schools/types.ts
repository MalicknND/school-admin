import type { PlatformUser } from "@/features/users/types";

export type SchoolType = "COLLEGE" | "LYCEE" | "COLLEGE_LYCEE" | "PRIMAIRE" | "AUTRE";

export type PlatformStatus = "EN_SERVICE" | "SUSPENDU" | "ARCHIVE";

export type School = {
  id: string;
  name: string;
  code?: string;
  shortName?: string;
  type?: SchoolType;
  address?: string;
  city?: string;
  region?: string;
  phone?: string;
  email?: string;
  website?: string;
  directorName?: string;
  active?: boolean;
  configured?: boolean;
  platformStatus?: PlatformStatus;
  createdAt?: string;
  updatedAt?: string;
};

/** POST /api/schools/with-school-admin */
export type CreateSchoolWithAdminRequest = {
  schoolName: string;
  schoolCode: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type SchoolWithDirector = {
  school: School;
  director?: PlatformUser;
};
