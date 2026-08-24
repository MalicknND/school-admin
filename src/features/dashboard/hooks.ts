import { useMemo } from "react";
import { useSchools } from "@/features/schools/hooks";
import { useUsers } from "@/features/users/hooks";
import { computePlatformStats, sortByCreatedAtDesc } from "./stats";

export function usePlatformOverview() {
  const schoolsQuery = useSchools();
  const usersQuery = useUsers();

  const stats = useMemo(
    () => computePlatformStats(schoolsQuery.data, usersQuery.data),
    [schoolsQuery.data, usersQuery.data],
  );

  const recentSchools = useMemo(
    () => sortByCreatedAtDesc(schoolsQuery.data ?? []).slice(0, 5),
    [schoolsQuery.data],
  );

  return { schoolsQuery, usersQuery, stats, recentSchools };
}
