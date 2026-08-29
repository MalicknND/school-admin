import type { CreateSchoolWithAdminRequest } from "../types";

export type CreateSchoolFormValues = CreateSchoolWithAdminRequest & { confirmPassword: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCreateSchool(values: CreateSchoolFormValues) {
  const errors: Partial<Record<keyof CreateSchoolFormValues, string>> = {};
  if (!values.schoolName.trim()) errors.schoolName = "Le nom de l’établissement est obligatoire.";
  else if (values.schoolName.trim().length > 150) errors.schoolName = "150 caractères maximum.";
  if (!values.schoolCode.trim()) errors.schoolCode = "Le code établissement est obligatoire.";
  else if (values.schoolCode.trim().length > 50) errors.schoolCode = "50 caractères maximum.";
  if (!values.firstName.trim()) errors.firstName = "Le prénom est obligatoire.";
  if (!values.lastName.trim()) errors.lastName = "Le nom est obligatoire.";
  if (!values.email.trim()) errors.email = "L’email est obligatoire.";
  else if (!EMAIL_RE.test(values.email.trim())) errors.email = "Adresse email invalide.";
  if (!values.password) errors.password = "Le mot de passe temporaire est obligatoire.";
  else if (values.password.length < 8) errors.password = "8 caractères minimum.";
  if (values.confirmPassword !== values.password)
    errors.confirmPassword = "Les mots de passe ne correspondent pas.";
  return errors;
}

export const EMPTY: CreateSchoolFormValues = {
  schoolName: "",
  schoolCode: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
