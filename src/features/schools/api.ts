import { apiClient } from "@/lib/apiClient";
import type {
  CreateSchoolWithAdminRequest,
  PlatformStatus,
  School,
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
