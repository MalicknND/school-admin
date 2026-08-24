export const APP_NAME = "School Manager";
export const PORTAL_NAME = "Platform Admin";
export const APP_TAGLINE = "Gestion de la plateforme scolaire";

export const API_BASE_URL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined)?.replace(/\/$/, "") ??
  "http://localhost:8081";
