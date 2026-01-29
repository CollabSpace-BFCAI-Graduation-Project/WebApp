"use client";
import { AuthMode } from "@/lib/types";
import { AuthFormTabs } from "./auth-form-tabs";
import { RegisterForm } from "../register/register-form";
import { LoginForm } from "../login/login-form";
import { useAuthForms } from "@/providers/auth-forms-provider";

interface AuthFormProps {
  mode: AuthMode;
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  const { registerForm, loginForm } = useAuthForms();
  return (
    <>
      <AuthFormTabs mode={mode} />

      {mode === "register" ? (
        <RegisterForm form={registerForm} />
      ) : (
        <LoginForm form={loginForm} />
      )}
    </>
  );
};
