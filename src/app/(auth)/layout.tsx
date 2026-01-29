import { AuthFormsProvider } from "@/providers/auth-forms-provider";
import { AuthHeader } from "./auth-header";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full max-w-130 m-auto py-6 space-y-6">
      <AuthHeader />
      <AuthFormsProvider>{children}</AuthFormsProvider>
    </div>
  );
}
