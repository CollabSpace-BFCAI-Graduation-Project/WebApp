import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CollabSpace — Where Teams Come Alive",
  description:
    "CollabSpace is a browser-based 3D virtual collaboration platform. Work together in real-time with immersive 3D spaces, team chat, and powerful file sharing.",
};

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
  return <>{children}</>;
}
