import { createContext } from "react";
import type { PlatformSession } from "@/lib/session";
import type { AuthUser } from "./types";

export type AuthContextValue = {
  session: PlatformSession | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** false tant que la session locale n'a pas été lue (SSR / 1er rendu). */
  ready: boolean;
  setSession: (session: PlatformSession) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
