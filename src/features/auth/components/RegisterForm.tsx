"use client";

import { motion } from "motion/react";
import { useFormState } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { FormController } from "@/components/shared/FormController";
import Link from "next/link";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { useRouter } from "next/navigation";
import { RegisterFormData } from "@/features/auth/schemas";
import { useAuthForms } from "@/context/AuthForms";
import { register } from "../services";
import { useAuthStore } from "@/store/auth-store";
import { ApiError } from "@/lib/api-client";
import { fadeInUp } from "@/lib/animations";
import { useMounted } from "@/hooks/useMounted";

export function RegisterForm() {
  const {
    registerForm: { control, handleSubmit },
    resetAuthForms,
  } = useAuthForms();
  const { isSubmitting } = useFormState({ control });
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const mounted = useMounted();

  async function onSubmit(data: RegisterFormData) {
    try {
      const session = await register(data);
      setAuth(session.user, session.token, session.refreshToken);
      toast.success("Account created successfully!");
      resetAuthForms();
      router.replace("/dashboard");
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 409 &&
        typeof error.details === "object" &&
        error.details !== null &&
        "errors" in error.details
      ) {
        const fields = Object.keys(
          (error.details as { errors: Record<string, string[]> }).errors,
        );
        const hasEmail = fields.some((f) =>
          f.toLowerCase().includes("email") ||
          JSON.stringify((error.details as { errors: Record<string, string[]> }).errors[f]).toLowerCase().includes("email"),
        );
        const hasUsername = fields.some((f) =>
          f.toLowerCase().includes("username") ||
          JSON.stringify((error.details as { errors: Record<string, string[]> }).errors[f]).toLowerCase().includes("username"),
        );

        if (hasEmail && hasUsername) {
          toast.error("Email and username are already taken.");
        } else if (hasEmail) {
          toast.error("Email is already taken.");
        } else if (hasUsername) {
          toast.error("Username is already taken.");
        } else {
          toast.error("Account already exists.");
        }
      } else {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to create your account right now.",
        );
      }
    }
  }

  return (
    <Card className="w-full gap-5">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} id="register" noValidate>
          <FieldGroup className="gap-1.5">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <FormController
                  name="fullName"
                  label="Full Name"
                  placeholder="Full name"
                  autoComplete="name"
                  control={control}
                  type="text"
                />
              </div>
              <div className="flex-1">
                <FormController
                  name="username"
                  label="Username"
                  placeholder="Username"
                  autoComplete="username"
                  control={control}
                  type="text"
                />
              </div>
            </div>
            <FormController
              name="email"
              label="Email Address"
              placeholder="Email address"
              autoComplete="email"
              control={control}
              type="email"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <PasswordInput
                  control={control}
                  name="password"
                  label="Password"
                  autoComplete="new-password"
                />
              </div>
              <div className="flex-1">
                <PasswordInput
                  control={control}
                  name="confirmPassword"
                  label="Confirm Password"
                  autoComplete="off"
                />
              </div>
            </div>
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
                form="register"
                className="w-full cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create account"}
                {!isSubmitting && <ArrowRight className="ml-1" />}
              </Button>
            </motion.div>
            <motion.div
              initial={fadeInUp.initial}
              animate={fadeInUp.animate}
              transition={{ ...fadeInUp.transition, delay: 0.1 }}
            >
              <p className="text-sm text-muted-foreground space-x-1 mt-2">
                <span>Already have an account?</span>
                <Link href="/login" className="font-semibold hover:underline">
                  Login
                </Link>
              </p>
            </motion.div>
          </>
        ) : (
          <>
            <Button
              type="submit"
              form="register"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create account"}
              {!isSubmitting && <ArrowRight className="ml-1" />}
            </Button>
            <p className="text-sm text-muted-foreground space-x-1 mt-2">
              <span>Already have an account?</span>
              <Link href="/login" className="font-semibold hover:underline">
                Login
              </Link>
            </p>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
