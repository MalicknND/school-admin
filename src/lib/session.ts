import type { AuthUser } from "@/features/auth/types";

export const SESSION_KEY = "school-manager.platform.session";

export type PlatformSession = {
  token: string;
  tokenType?: string;
  expiresAt?: string;
  user: AuthUser;
};

const listeners = new Set<(session: PlatformSession | null) => void>();

export function readSession(): PlatformSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlatformSession;
    if (!parsed?.token || parsed.user?.role !== "SUPER_ADMIN") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: PlatformSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  listeners.forEach((l) => l(session));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
  listeners.forEach((l) => l(null));
}

export function subscribeSession(listener: (session: PlatformSession | null) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getToken(): string | null {
  return readSession()?.token ?? null;
}
