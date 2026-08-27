import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSchoolWithAdmin,
  fetchSchool,
  fetchSchools,
  hardDeleteSchool,
  updateSchoolPlatformStatus,
} from "./api";
import type { PlatformStatus } from "./types";

export const schoolsKeys = {
  all: ["schools"] as const,
  detail: (id: string) => ["schools", id] as const,
};

export function useSchools() {
  return useQuery({ queryKey: schoolsKeys.all, queryFn: fetchSchools });
}

export function useSchool(id: string) {
  return useQuery({
    queryKey: schoolsKeys.detail(id),
    queryFn: () => fetchSchool(id),
    enabled: Boolean(id),
  });
}

export function useCreateSchoolWithAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSchoolWithAdmin,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: schoolsKeys.all });
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdatePlatformStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, platformStatus }: { id: string; platformStatus: PlatformStatus }) =>
      updateSchoolPlatformStatus(id, platformStatus),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: schoolsKeys.all });
      void queryClient.invalidateQueries({ queryKey: schoolsKeys.detail(variables.id) });
    },
  });
}

export function useHardDeleteSchool() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) => hardDeleteSchool(id, force),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({ queryKey: schoolsKeys.all });
      queryClient.removeQueries({ queryKey: schoolsKeys.detail(variables.id) });
    },
  });
}
