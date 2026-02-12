"use client";
import { AuthMode } from "@/lib/types";
import { AuthFormTabs } from "./AuthFormTabs";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";

interface AuthFormProps {
  mode: AuthMode;
}

export const AuthForm = ({ mode }: AuthFormProps) => {
  return (
    <>
      <AuthFormTabs mode={mode} />
      {mode === "register" ? <RegisterForm /> : <LoginForm />}
    </>
  );
};
