"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import UpdateProfileAvatar from "./UpdateProfileAvatar";
import {
  ProfileSettingsSchema,
  profileSettingsSchema,
} from "@/features/settings/schemas";
import { Textarea } from "@/components/ui/textarea";

export function ProfileSettings() {
  const form = useForm<ProfileSettingsSchema>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: "Mohamed",
      username: "@moatia22",
      email: "mohamed@gmail.com",
      bio: "Hello, I'm Mohamed",
    },
  });

  function onSubmit(data: ProfileSettingsSchema) {
    console.log(data);
    toast.success("Profile updated successfully!");
  }

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <UpdateProfileAvatar />
        <form id="profile-settings-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <div className="flex items-center gap-4">
              <Controller
                name="displayName"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="profile-settings-display-name">
                      Display Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="profile-settings-display-name"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. Mohamed"
                      autoComplete="off"
                    />
                    <div className="h-4">
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-xs"
                        />
                      )}
                    </div>
                  </Field>
                )}
              />
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-1">
                    <FieldLabel htmlFor="profile-settings-username">
                      Username
                    </FieldLabel>
                    <Input
                      {...field}
                      id="profile-settings-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="e.g. @moatia22"
                      autoComplete="off"
                    />
                    <div className="h-4">
                      {fieldState.invalid && (
                        <FieldError
                          errors={[fieldState.error]}
                          className="text-xs"
                        />
                      )}
                    </div>
                  </Field>
                )}
              />
            </div>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="profile-settings-email">
                    Email
                  </FieldLabel>
                  <Input
                    {...field}
                    id="profile-settings-email"
                    aria-invalid={fieldState.invalid}
                    disabled
                  />
                </Field>
              )}
            />
            <Controller
              name="bio"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="gap-1">
                  <FieldLabel htmlFor="profile-settings-bio">Bio</FieldLabel>
                  <Textarea
                    {...field}
                    id="profile-settings-bio"
                    aria-invalid={fieldState.invalid}
                    placeholder="e.g. Hello, I'm Mohamed"
                    autoComplete="off"
                    rows={4}
                    className="resize-none min-h-24 max-h-24"
                  />
                  <div className="h-4">
                    {fieldState.invalid && (
                      <FieldError
                        errors={[fieldState.error]}
                        className="text-xs"
                      />
                    )}
                  </div>
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="responsive">
          <Button type="submit" form="profile-settings-form">
            Save Changes
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
