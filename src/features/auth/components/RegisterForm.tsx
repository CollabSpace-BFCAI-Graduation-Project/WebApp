"use client";

import { useFormState } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { FormController } from "@/components/shared/FormController";
import Link from "next/link";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { GoogleIcon } from "@/components/shared/GoogleIcon";
import { useRouter } from "next/navigation";
import { RegisterFormData } from "@/features/auth/schemas";
import { useAuthForms } from "@/context/AuthForms";

export function RegisterForm() {
  const {
    registerForm: { control, handleSubmit },
    resetAuthForms,
  } = useAuthForms();
  const { isSubmitting } = useFormState({ control });
  const router = useRouter();

  const createAccount = async (data: RegisterFormData) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        console.log(data);
      }, 2000);
    });
  };

  async function onSubmit(data: RegisterFormData) {
    console.log("Register form submitted:", data);
    await createAccount(data);
    toast.success("Account created successfully!");
    resetAuthForms();
    router.replace("/");
  }

  return (
    <Card className="w-full gap-5">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} id="register" noValidate>
          <FieldGroup className="gap-1.5">
            <div className="flex flex-col xs:flex-row gap-3">
              <FormController
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                autoComplete="name"
                control={control}
                type="text"
              />
              <FormController
                name="username"
                label="Username"
                placeholder="john_doe"
                autoComplete="username"
                control={control}
                type="text"
              />
            </div>
            <FormController
              name="email"
              label="Email Address"
              placeholder="pK9b0@example.com"
              autoComplete="email"
              control={control}
              type="email"
            />
            <div className="flex flex-col xs:flex-row gap-3">
              <PasswordInput
                control={control}
                name="password"
                label="Password"
                autoComplete="new-password"
              />
              <PasswordInput
                control={control}
                name="confirmPassword"
                label="Confirm Password"
                autoComplete="off"
              />
            </div>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="flex w-full justify-between gap-4">
          <Button
            type="submit"
            form="register"
            className="flex-1 cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create account"}
            {!isSubmitting && <ArrowRight className="ml-1" />}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {}}
            title="Login with Google"
            className="cursor-pointer"
          >
            <GoogleIcon />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground space-x-1 mt-2">
          <span>Already have an account?</span>
          <Link href="/login" className="font-semibold hover:underline">
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
