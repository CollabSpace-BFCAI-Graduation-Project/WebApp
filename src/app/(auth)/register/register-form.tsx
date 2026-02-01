"use client";

import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { RegisterFormData } from "@/schemas/auth-forms";
import { ArrowRight } from "lucide-react";
import { FieldGroup } from "@/components/ui/field";
import { FormController } from "@/components/shared/form-controller";
import Link from "next/link";
import { PasswordInput } from "@/components/shared/password-input";
import { GoogleIcon } from "@/components/shared/google-icon";

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormData>;
}

export function RegisterForm({ form }: RegisterFormProps) {
  const createAccount = async (data: RegisterFormData) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        console.log(data);
        form.reset();
      }, 2000);
    });
  };

  async function onSubmit(data: RegisterFormData) {
    console.log("Register form submitted:", data);
    toast.promise(createAccount(data), {
      loading: "Creating your account...",
      success: "Account created successfully!",
      error: "Failed to create account. Please try again.",
    });
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
            className="flex-1 bg-black text-white hover:bg-black/85 cursor-pointer"
          >
            Create account
            <ArrowRight className="ml-1" />
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {}}
            title="Login with Google"
          >
            <GoogleIcon />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground space-x-1 mt-2">
          <span className="text-muted-foreground">
            Already have an account?
          </span>
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
