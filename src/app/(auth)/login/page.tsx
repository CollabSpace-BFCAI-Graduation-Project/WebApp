import { AuthForm } from "@/features/auth/components/AuthForm";

export default function LoginPage() {
  return <AuthForm mode="login" />;
}

export const metadata = {
  title: "Login",
};
