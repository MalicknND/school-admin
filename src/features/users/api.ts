import { apiClient } from "@/lib/apiClient";
import type { PlatformUser, ResetPasswordResult } from "./types";

export function fetchUsers() {
  return apiClient.get<PlatformUser[]>("/api/users");
}

export function resetPassword(userId: string) {
  return apiClient.post<ResetPasswordResult>(`/api/users/${userId}/reset-password`);
}
