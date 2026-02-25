"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { AuthMode } from "../types";
import { useAuthForms } from "@/context/AuthForms";

interface AuthFormTabsProps {
  mode: AuthMode;
}

export function AuthFormTabs({ mode }: AuthFormTabsProps) {
  const router = useRouter();
  const { clearAuthFormsErrors } = useAuthForms();

  return (
    <Tabs
      value={mode}
      onValueChange={(value) => {
        router.push(`/${value}`);
        clearAuthFormsErrors();
      }}
    >
      <TabsList className="w-full">
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
