"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/lib/types/api-types";
import { getInitials } from "@/features/spaces/components/space-details/space-utils";
import { uploadCurrentProfileAvatar } from "../../services";

interface UpdateProfileAvatarProps {
  profile: Profile;
}

const UpdateProfileAvatar = ({ profile }: UpdateProfileAvatarProps) => {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const uploadMutation = useMutation({
    mutationFn: uploadCurrentProfileAvatar,
    onSuccess: async (response) => {
      toast.success("Avatar updated.");
      queryClient.setQueryData<Profile | undefined>(["profile", "me"], (current) =>
        current
          ? {
              ...current,
              avatarImage: response.avatarImage ?? current.avatarImage,
            }
          : current,
      );
      await queryClient.invalidateQueries({ queryKey: ["profile", "me"] });
      if (avatarInputRef.current) {
        avatarInputRef.current.value = "";
      }
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Unable to update avatar.",
      );
    },
  });

  return (
    <div className="flex items-center gap-4">
      <Avatar className="group relative size-14 self-start">
        <button
          type="button"
          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          onClick={() => avatarInputRef.current?.click()}
        >
          <Camera className="size-5 text-white" />
        </button>
        {profile.avatarImage && <AvatarImage src={profile.avatarImage} />}
        <AvatarFallback>{getInitials(profile.name)}</AvatarFallback>
      </Avatar>
      <Field className="flex flex-row gap-2">
        <Input
          type="file"
          hidden
          ref={avatarInputRef}
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              uploadMutation.mutate(file);
            }
          }}
        />
        <div className="flex flex-col items-start gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-fit cursor-pointer"
            disabled={uploadMutation.isPending}
            onClick={() => avatarInputRef.current?.click()}
          >
            {uploadMutation.isPending ? "Uploading..." : "Change Avatar"}
          </Button>
          <FieldDescription className="text-nowrap text-xs text-muted-foreground">
            JPG, PNG, or WebP. Max 2MB.
          </FieldDescription>
        </div>
      </Field>
    </div>
  );
};

export default UpdateProfileAvatar;
