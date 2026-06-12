"use client";

import { motion } from "motion/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { FormController } from "@/components/shared/FormController";
import Link from "next/link";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { useFormState } from "react-hook-form";
import { useRouter } from "next/navigation";
import { LoginFormData } from "../schemas";
import { useAuthForms } from "@/context/AuthForms";
import { login } from "../services";
import { useAuthStore } from "@/store/auth-store";
import { fadeInUp } from "@/lib/animations";
import { useMounted } from "@/hooks/useMounted";

export function LoginForm() {
  const {
    loginForm: { control, handleSubmit },
    resetAuthForms,
  } = useAuthForms();
  const { isSubmitting } = useFormState({ control });
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const mounted = useMounted();

  async function onSubmit(data: LoginFormData) {
    try {
      const session = await login(data);
      setAuth(session.user, session.token, session.refreshToken);
      toast.success("Logged in successfully!");
      resetAuthForms();
      router.replace(getSafeReturnTo(getReturnToParam()));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to log in right now.",
      );
    }
  }

  return (
    <Card className="w-full gap-5">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} id="login" noValidate>
          <FieldGroup className="gap-1.5">
            <FormController
              name="email"
              label="Email Address"
              placeholder="Email address"
              control={control}
              type="email"
              autoComplete="email"
            />
            <PasswordInput
              control={control}
              name="password"
              label="Password"
              autoComplete="current-password"
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {mounted ? (
          <>
            <motion.div
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={fadeInUp.transition}
            >
              <Button
                type="submit"
                form="login"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
                {!isSubmitting && <ArrowRight className="ml-1" />}
              </Button>
            </motion.div>
            <motion.div
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={{ ...fadeInUp.transition, delay: 0.1 }}
            >
              <p className="text-sm text-muted-foreground space-x-1 mt-2">
                <span>Don&apos;t have an account?</span>
                <Link href="/register" className="font-semibold hover:underline">
                  Sign up
                </Link>
              </p>
            </motion.div>
          </>
        ) : (
          <>
            <Button
              type="submit"
              form="login"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
              {!isSubmitting && <ArrowRight className="ml-1" />}
            </Button>
            <p className="text-sm text-muted-foreground space-x-1 mt-2">
              <span>Don&apos;t have an account?</span>
              <Link href="/register" className="font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  );
}

function getReturnToParam() {
  if (typeof window === "undefined") {
    return null;
  }

  return new URLSearchParams(window.location.search).get("returnTo");
}

function getSafeReturnTo(returnTo: string | null) {
  if (!returnTo?.startsWith("/") || returnTo.startsWith("//")) {
    return "/";
  }

  return returnTo;
}
