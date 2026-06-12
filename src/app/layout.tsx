import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/Theme";
import { Toaster } from "@/components/ui/sonner";
import { cookies } from "next/headers";
import { ThemeColor } from "@/lib/types/types";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryProvider } from "@/context/QueryProvider";
import { Geist_Mono, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const interHeading = Inter({subsets:['latin'],variable:'--font-heading'});

const geistMono = Geist_Mono({subsets:['latin'],variable:'--font-mono'});

export const metadata: Metadata = {
  title: "CollabSpace",
  description:
    "CollabSpace is a new way to work together with your team in a productive and fun way.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const cookieStore = await cookies();
  const themeColor: ThemeColor =
    (cookieStore.get("themeColor")?.value as ThemeColor) || "orange";

  return (
    <html
      lang="en"
      data-theme={themeColor}
      suppressHydrationWarning className={cn("font-mono", geistMono.variable, interHeading.variable)}
    >
      <body className={`antialiased`}>
        <ThemeProvider initialThemeColor={themeColor}>
          <QueryProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </QueryProvider>
          <Toaster richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}