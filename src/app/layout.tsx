import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/Theme";
import { Toaster } from "@/components/ui/sonner";
import { ThemeColorProvider } from "@/contexts/ThemeColor";
import { cookies } from "next/headers";
import { ThemeColor } from "@/lib/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collab Space",
  description:
    "Collab Space is a new way to work together with your team in a productive and fun way.",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  const cookieStore = await cookies();
  const themeColor = cookieStore.get("themeColor")?.value || "claude";
  return (
    <html lang="en" data-theme={themeColor} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <ThemeColorProvider initialThemeColor={themeColor as ThemeColor}>
            <main>{children}</main>
          </ThemeColorProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
