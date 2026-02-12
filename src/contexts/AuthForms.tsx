"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContext, useContext } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  LoginFormData,
  loginFormSchema,
  RegisterFormData,
  registerFormSchema,
} from "@/features/auth/schemas";

const AuthFormsContext = createContext<{
  registerForm: UseFormReturn<RegisterFormData>;
  loginForm: UseFormReturn<LoginFormData>;
  resetAuthForms: () => void;
}>({
  registerForm: {} as UseFormReturn<RegisterFormData>,
  loginForm: {} as UseFormReturn<LoginFormData>,
  resetAuthForms: () => {},
});

export const AuthFormsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const resetAuthForms = () => {
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <AuthFormsContext.Provider
      value={{ registerForm, loginForm, resetAuthForms }}
    >
      {children}
    </AuthFormsContext.Provider>
  );
};

export function useAuthForms() {
  const context = useContext(AuthFormsContext);
  if (!context) {
    throw new Error("useAuthForms must be used within an AuthFormsProvider");
  }
  return context;
}
