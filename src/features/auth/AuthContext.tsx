import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  clearSession,
  readSession,
  saveSession,
  subscribeSession,
  type PlatformSession,
} from "@/lib/session";
import { AuthContext, type AuthContextValue } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSessionState] = useState<PlatformSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSessionState(readSession());
    setReady(true);
    return subscribeSession(setSessionState);
  }, []);

  const setSession = useCallback((next: PlatformSession) => {
    saveSession(next);
    setSessionState(next);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSessionState(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.token) && session?.user.role === "SUPER_ADMIN",
      ready,
      setSession,
      signOut,
    }),
    [session, ready, setSession, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
