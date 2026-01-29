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
        <TabsTrigger
          className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground h-8"
          value="register"
        >
          Register
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground h-8 transition-colors duration-300"
          value="login"
        >
          Login
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
