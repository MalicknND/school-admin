import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSchoolWithAdmin, fetchSchool, fetchSchools } from "./api";

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
