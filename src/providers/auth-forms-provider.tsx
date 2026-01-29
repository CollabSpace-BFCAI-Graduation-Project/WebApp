"use client";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormData,
  loginFormSchema,
  RegisterFormData,
  registerFormSchema,
} from "@/schemas/auth-forms";

import { createContext, useContext } from "react";

const AuthContext = createContext<{
  registerForm: UseFormReturn<RegisterFormData>;
  loginForm: UseFormReturn<LoginFormData>;
}>({
  registerForm: {} as UseFormReturn<RegisterFormData>,
  loginForm: {} as UseFormReturn<LoginFormData>,
});

export const AuthFormsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <AuthContext.Provider value={{ registerForm, loginForm }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthForms() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthForms must be used within an AuthFormsProvider");
  }
  return context;
}
