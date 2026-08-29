import { useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { login } from "./api";
import { AuthContext } from "./auth-context";
import type { LoginRequest } from "./types";

export const UNAUTHORIZED_PORTAL_MESSAGE =
  "Ce portail est réservé à l’administrateur de la plateforme.";

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans <AuthProvider>");
  return ctx;
}

export function useLogin() {
  const { setSession } = useAuth();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const result = await login(payload);
      if (result?.user?.role !== "SUPER_ADMIN") {
        // Aucune session n'est stockée pour les autres rôles.
        throw new Error(UNAUTHORIZED_PORTAL_MESSAGE);
      }
      return result;
    },
    onSuccess: (result) => {
      setSession({
        token: result.token,
        ...(result.tokenType ? { tokenType: result.tokenType } : {}),
        ...(result.expiresAt ? { expiresAt: result.expiresAt } : {}),
        user: result.user,
      });
      void navigate({ to: "/dashboard", replace: true });
    },
  });
}

export function useSignOut() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    signOut();
    void navigate({ to: "/login", replace: true });
  };
}
