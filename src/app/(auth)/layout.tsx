import { AuthFormsProvider } from "@/components/providers/AuthFormsProvider";
import { AuthPagesHeader } from "./_auth-components/AuthPagesHeader";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="w-full max-w-130 m-auto py-6 space-y-6">
      <AuthPagesHeader />
      <AuthFormsProvider>{children}</AuthFormsProvider>
    </div>
  );
}
