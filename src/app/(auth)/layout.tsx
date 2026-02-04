import { AuthFormsProvider } from "@/components/providers/AuthFormsProvider";
import { AuthPagesHeader } from "./_auth-components/AuthPagesHeader";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="max-w-4/5 sm:max-w-130 m-auto py-8 space-y-8">
      <AuthPagesHeader />
      <AuthFormsProvider>{children}</AuthFormsProvider>
    </div>
  );
}
