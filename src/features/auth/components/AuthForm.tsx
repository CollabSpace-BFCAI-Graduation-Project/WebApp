"use client";
import { AuthFormTabs } from "./AuthFormTabs";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";
import { AuthMode } from "../types";

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
