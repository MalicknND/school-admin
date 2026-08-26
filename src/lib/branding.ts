export const APP_NAME = "School Manager";
export const PORTAL_NAME = "Platform Admin";
export const APP_TAGLINE = "Gestion de la plateforme scolaire";

const rawApiBaseUrl = import.meta.env["VITE_API_BASE_URL"] as string | undefined;

if (import.meta.env.PROD && !rawApiBaseUrl) {
  // Le fallback ci-dessous reste utile en dev, mais en prod il ne doit jamais être atteint
  // silencieusement : sans cette variable, l'app taperait sur localhost:8081 depuis le
  // navigateur d'un utilisateur réel.
  console.error(
    "VITE_API_BASE_URL n'est pas définie — l'admin va utiliser http://localhost:8081, ce qui ne fonctionnera pas en production.",
  );
}

export const API_BASE_URL = rawApiBaseUrl?.replace(/\/$/, "") ?? "http://localhost:8081";
