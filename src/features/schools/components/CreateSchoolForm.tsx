import { useState } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/layout/StateBlocks";
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

const EMPTY: CreateSchoolFormValues = {
  schoolName: "",
  schoolCode: "",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export function CreateSchoolForm({
  onSubmit,
  isPending,
  error,
}: {
  onSubmit: (payload: CreateSchoolWithAdminRequest) => void;
  isPending: boolean;
  error: unknown;
}) {
  const [values, setValues] = useState<CreateSchoolFormValues>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateSchoolFormValues, string>>>({});

  const set = (key: keyof CreateSchoolFormValues) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateCreateSchool(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    onSubmit({
      schoolName: values.schoolName.trim(),
      schoolCode: values.schoolCode.trim(),
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      password: values.password,
    });
  };

  const field = (
    key: keyof CreateSchoolFormValues,
    label: string,
    type: string = "text",
    autoComplete?: string,
  ) => (
    <div className="space-y-1.5">
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type={type}
        value={values[key]}
        onChange={set(key)}
        {...(autoComplete ? { autoComplete } : {})}
      />
      {errors[key] ? <p className="text-xs text-destructive">{errors[key]}</p> : null}
    </div>
  );

  return (
    <form className="grid gap-6 lg:grid-cols-2" onSubmit={handleSubmit} noValidate>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Établissement</CardTitle>
          <CardDescription>Identité de l’école créée sur la plateforme.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {field("schoolName", "Nom de l’établissement")}
          {field("schoolCode", "Code établissement")}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Compte administrateur d’école</CardTitle>
          <CardDescription>Premier compte SCHOOL_ADMIN de l’établissement.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {field("firstName", "Prénom")}
            {field("lastName", "Nom")}
          </div>
          {field("email", "Email", "email", "off")}
          {field("password", "Mot de passe temporaire", "password", "new-password")}
          {field("confirmPassword", "Confirmation", "password", "new-password")}
          <p className="flex items-start gap-2 rounded-md bg-muted p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-4 shrink-0" />
            L’administrateur devra changer ce mot de passe temporaire à sa première connexion, depuis
            le frontend école.
          </p>
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-3">
        {error ? <ErrorState error={error} /> : null}
        <Button type="submit" disabled={isPending}>
          {isPending ? "Création…" : "Créer l’établissement"}
        </Button>
      </div>
    </form>
  );
}
