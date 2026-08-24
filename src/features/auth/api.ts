import { apiClient } from "@/lib/apiClient";
import type { LoginRequest, LoginResponse } from "./types";

export function login(payload: LoginRequest) {
  return apiClient.post<LoginResponse>("/api/auth/login", payload, { anonymous: true });
}
