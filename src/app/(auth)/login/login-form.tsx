"use client";

import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LoginFormData } from "@/schemas/auth-forms";
import { ArrowRight } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { FormController } from "@/components/shared/form-controller";
import Link from "next/link";
import { SeparatorWithText } from "@/components/shared/separator-with-text";
import { PasswordInput } from "@/components/shared/password-input";
import { useResetAuthForms } from "@/providers/auth-forms-provider";
import { GoogleIcon } from "@/components/shared/google-icon";
import { useFormState } from "react-hook-form";
import { useRouter } from "next/navigation";

interface LoginFormProps {
  form: UseFormReturn<LoginFormData>;
}

export function LoginForm({ form }: LoginFormProps) {
  const resetAuthForms = useResetAuthForms();
  const { isSubmitting } = useFormState({ control: form.control });
  const router = useRouter();

  const login = async (data: LoginFormData) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        console.log(data);
      }, 2000);
    });
  };

  async function onSubmit(data: LoginFormData) {
    console.log("Login form submitted:", data);
    await login(data);
    toast.success("Logged in successfully!");
    resetAuthForms();
    router.replace("/");
  }

  return (
    <Card className="w-full gap-5">
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} id="login" noValidate>
          <FieldGroup className="gap-1.5">
            <FormController
              name="email"
              label="Email Address"
              placeholder="pK9b0@example.com"
              autoComplete="email"
              control={form.control}
              type="email"
            />
            <PasswordInput form={form} name="password" label="Password" />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col">
        {/* login button */}
        <Button
          type="submit"
          form="login"
          className="w-full cursor-pointer"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Log in"}
          {!isSubmitting && <ArrowRight className="ml-1" />}
        </Button>
        <SeparatorWithText>or</SeparatorWithText>
        {/* sign in with google */}
        <Button
          type="button"
          variant="outline"
          className="w-full cursor-pointer"
          onClick={() => {}}
        >
          <GoogleIcon />
          <span>Continue with Google</span>
        </Button>
        {/* Auth form switcher */}
        <p className="text-sm text-muted-foreground space-x-1 mt-2">
          <span>Don&apos;t have an account?</span>
          <Link href="/register" className="font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
