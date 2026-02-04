"use client";

import { UseFormReturn, useFormState } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RegisterFormData } from "@/schemas/auth-forms";
import { ArrowRight } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { FormController } from "@/components/shared/FormController";
import Link from "next/link";
import { PasswordInput } from "@/components/shared/PasswordInput";
import { GoogleIcon } from "@/components/shared/GoogleIcon";
import { useResetAuthForms } from "@/hooks/auth-forms";
import { useRouter } from "next/navigation";

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormData>;
}

export function RegisterForm({ form }: RegisterFormProps) {
  const resetAuthForms = useResetAuthForms();
  const { isSubmitting } = useFormState({ control: form.control });
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
        <form onSubmit={form.handleSubmit(onSubmit)} id="register" noValidate>
          <FieldGroup className="gap-1.5">
            <div className="flex gap-3">
              <FormController
                name="fullName"
                label="Full Name"
                placeholder="John Doe"
                autoComplete="name"
                control={form.control}
                type="text"
              />
              <FormController
                name="username"
                label="Username"
                placeholder="john_doe"
                autoComplete="username"
                control={form.control}
                type="text"
              />
            </div>
            <FormController
              name="email"
              label="Email Address"
              placeholder="pK9b0@example.com"
              autoComplete="email"
              control={form.control}
              type="email"
            />
            <div className="flex gap-3">
              <PasswordInput form={form} name="password" label="Password" />
              <PasswordInput
                form={form}
                name="confirmPassword"
                label="Confirm Password"
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
