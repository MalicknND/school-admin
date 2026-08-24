import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUsers, resetPassword } from "./api";

export const usersKeys = { all: ["users"] as const };

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: fetchUsers,
    // Endpoint réservé au SUPER_ADMIN : une erreur reste affichée telle quelle.
    retry: false,
  });
}

export function useResetPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
}
