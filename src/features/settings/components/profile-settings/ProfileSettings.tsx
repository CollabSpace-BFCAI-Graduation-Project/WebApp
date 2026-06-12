"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Skeleton } from "@/components/ui/skeleton";
import UpdateProfileAvatar from "./UpdateProfileAvatar";
import {
  ProfileSettingsSchema,
  profileSettingsSchema,
} from "@/features/settings/schemas";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentProfile, updateCurrentProfile, requestEmailChange } from "../../services";
import { useAuthStore } from "@/store/auth-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ProfileSettings() {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const authUser = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const {
    data: profile,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["profile", "me"],
    queryFn: getCurrentProfile,
  });
  const form = useForm<ProfileSettingsSchema>({
    resolver: zodResolver(profileSettingsSchema),
    defaultValues: {
      displayName: "",
      username: "",
      email: "",
      bio: "",
    },
  });
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const updateMutation = useMutation({
    mutationFn: (data: ProfileSettingsSchema) =>
      updateCurrentProfile({
        name: data.displayName,
        username: data.username,
        bio: data.bio ?? "",
      }),
    onSuccess: async (_data, variables) => {
      toast.success("Profile updated successfully.");
      await queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      if (authUser && token) {
        setAuth(
          {
            ...authUser,
            name: variables.displayName ?? authUser.name,
            username: variables.username ?? authUser.username,
          },
          token,
          refreshToken ?? undefined,
        );
      }
    },
    onError: (updateError) => {
      toast.error(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update profile.",
      );
    },
  });

  const emailChangeMutation = useMutation({
    mutationFn: () => requestEmailChange(newEmail, emailPassword),
    onSuccess: () => {
      toast.success("Confirmation link sent to new email.");
      setEmailDialogOpen(false);
      setNewEmail("");
      setEmailPassword("");
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to change email.",
      );
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        displayName: profile.name,
        username: profile.username,
        email: profile.email,
        bio: profile.bio ?? "",
      });
    }
  }, [form, profile]);

  useEffect(() => {
    if (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load profile.",
      );
    }
  }, [error]);

  function onSubmit(data: ProfileSettingsSchema) {
    updateMutation.mutate(data);
  }

  if (isLoading) {
    return (
      <Card className="h-full w-full overflow-y-auto">
        <CardContent className="flex flex-col gap-8">
          <Skeleton className="h-16 rounded-xl" />
          <Skeleton className="h-60 rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (error || !profile) {
    return (
      <Card className="h-full w-full overflow-y-auto">
        <CardContent className="flex min-h-60 items-center justify-center text-center">
          <div>
            <p className="font-medium">Profile unavailable</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Your profile could not be loaded."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full overflow-y-auto">
      <CardHeader className="sr-only">
        <CardTitle className="text-lg font-bold">Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <UpdateProfileAvatar profile={profile} />
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
                      placeholder="Display name"
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
                      placeholder="Username"
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
                  <div className="flex gap-2">
                    <Input
                      {...field}
                      id="profile-settings-email"
                      aria-invalid={fieldState.invalid}
                      disabled
                      className="flex-1"
                    />
                    <AlertDialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
                      <AlertDialogTrigger
                        render={
                          <Button type="button" variant="outline" size="sm" />
                        }
                      >
                        Change
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Change email</AlertDialogTitle>
                          <AlertDialogDescription>
                            Enter your new email and current password to request a change. A confirmation link will be sent to the new address.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex flex-col gap-3">
                          <Input
                            type="email"
                            value={newEmail}
                            placeholder="New email"
                            onChange={(e) => setNewEmail(e.target.value)}
                          />
                          <Input
                            type="password"
                            value={emailPassword}
                            autoComplete="current-password"
                            placeholder="Current password"
                            onChange={(e) => setEmailPassword(e.target.value)}
                          />
                        </div>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => {
                              setNewEmail("");
                              setEmailPassword("");
                            }}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            disabled={!newEmail || !emailPassword || emailChangeMutation.isPending}
                            onClick={(e) => {
                              e.preventDefault();
                              emailChangeMutation.mutate();
                            }}
                          >
                            {emailChangeMutation.isPending ? "Sending..." : "Send confirmation"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
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
                    placeholder="Bio"
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
          <Button
            type="submit"
            form="profile-settings-form"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
