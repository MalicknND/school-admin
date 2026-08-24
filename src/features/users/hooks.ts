import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "./api";

export const usersKeys = { all: ["users"] as const };

export function useUsers() {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: fetchUsers,
    // Endpoint réservé au SUPER_ADMIN : une erreur reste affichée telle quelle.
    retry: false,
  });
}
