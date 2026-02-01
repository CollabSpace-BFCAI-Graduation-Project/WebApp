import { LoginFormData, RegisterFormData } from "@/schemas/auth-forms";
import { createContext } from "react";
import { UseFormReturn } from "react-hook-form";

export const AuthFormsContext = createContext<{
  registerForm: UseFormReturn<RegisterFormData>;
  loginForm: UseFormReturn<LoginFormData>;
  resetAuthForms: () => void;
}>({
  registerForm: {} as UseFormReturn<RegisterFormData>,
  loginForm: {} as UseFormReturn<LoginFormData>,
  resetAuthForms: () => {},
});
