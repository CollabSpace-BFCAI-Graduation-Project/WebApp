"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { AuthMode } from "@/lib/types";

interface AuthFormTabsProps {
  mode: AuthMode;
}

export function AuthFormTabs({ mode }: AuthFormTabsProps) {
  const router = useRouter();

  return (
    <Tabs value={mode} onValueChange={(value) => router.push(`/${value}`)}>
      <TabsList className="w-full">
        <TabsTrigger value="register">Register</TabsTrigger>
        <TabsTrigger value="login">Login</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
