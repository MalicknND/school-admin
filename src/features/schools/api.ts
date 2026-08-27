import { apiClient } from "@/lib/apiClient";
import type {
  CreateSchoolWithAdminRequest,
  PlatformStatus,
  School,
  SchoolHardDeleteSummary,
  SchoolWithDirector,
} from "./types";

export function fetchSchools() {
  return apiClient.get<School[]>("/api/schools");
}

export function fetchSchool(id: string) {
  return apiClient.get<School>(`/api/schools/${id}`);
}

export function createSchoolWithAdmin(payload: CreateSchoolWithAdminRequest) {
  return apiClient.post<SchoolWithDirector>("/api/schools/with-school-admin", payload);
}

export function updateSchoolPlatformStatus(id: string, platformStatus: PlatformStatus) {
  return apiClient.post<School>(`/api/schools/${id}/platform-status`, { platformStatus });
}

/** DELETE /api/schools/{id}/hard-delete — réservé SUPER_ADMIN, suppression définitive et irréversible. */
export function hardDeleteSchool(id: string, force?: boolean) {
  return apiClient.delete<SchoolHardDeleteSummary>(
    `/api/schools/${id}/hard-delete${force ? "?force=true" : ""}`,
  );
}
