import { apiClient } from "@/lib/apiClient";
import type { PlatformUser } from "./types";

export function fetchUsers() {
  return apiClient.get<PlatformUser[]>("/api/users");
}
