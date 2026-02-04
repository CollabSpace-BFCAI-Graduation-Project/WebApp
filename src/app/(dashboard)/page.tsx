"use client";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function HomePage() {
  const { setTheme } = useTheme();
  const { setThemeColor } = useThemeColor();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-40">
      <div className="flex flex-row items-center justify-center gap-4">
        <Link href="/register">
          <Button variant="outline">Register</Button>
        </Link>
        <Link href="/login">
          <Button variant="outline">Login</Button>
        </Link>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <Button variant="outline" onClick={() => setTheme("system")}>
          System
        </Button>
        <Button variant="outline" onClick={() => setTheme("dark")}>
          Dark
        </Button>
        <Button variant="outline" onClick={() => setTheme("light")}>
          Light
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <Button variant="outline" onClick={() => setThemeColor("default")}>
          Default
        </Button>
        <Button variant="outline" onClick={() => setThemeColor("claude")}>
          Claude
        </Button>
        <Button variant="outline" onClick={() => setThemeColor("clymorphism")}>
          Clymorphism
        </Button>
        <Button variant="outline" onClick={() => setThemeColor("amethyst")}>
          Amethyst
        </Button>
        <Button variant="outline" onClick={() => setThemeColor("ocean")}>
          ocean
        </Button>
      </div>
    </div>
  );
}
