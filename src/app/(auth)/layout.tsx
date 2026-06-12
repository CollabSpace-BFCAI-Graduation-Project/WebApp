import { AuthRouteGuard } from "@/components/shared/AuthRouteGuard";
import { PageMotion } from "@/components/shared/PageMotion";
import { AuthFormsProvider } from "@/context/AuthForms";
import { AuthPagesHeader } from "@/features/auth/components/AuthPagesHeader";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="max-w-md mx-auto py-8 space-y-8">
      <AuthRouteGuard>
        <AuthPagesHeader />
        <PageMotion>
          <AuthFormsProvider>{children}</AuthFormsProvider>
        </PageMotion>
      </AuthRouteGuard>
    </div>
  );
}
