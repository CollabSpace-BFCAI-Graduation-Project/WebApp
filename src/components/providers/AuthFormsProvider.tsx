"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormData,
  loginFormSchema,
  RegisterFormData,
  registerFormSchema,
} from "@/schemas/auth-forms";
import { AuthFormsContext } from "@/contexts/authFormsContext";

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
