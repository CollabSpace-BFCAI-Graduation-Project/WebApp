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
          className="h-8 cursor-pointer data-[state=active]:bg-secondary!
           data-[state=active]:text-secondary-foreground!"
          value="register"
        >
          Register
        </TabsTrigger>
        <TabsTrigger
          className="h-8 cursor-pointer data-[state=active]:bg-secondary!
           data-[state=active]:text-secondary-foreground!"
          value="login"
        >
          Login
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
