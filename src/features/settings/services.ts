import { api } from "@/lib/api-client";
import { resolveBackendMediaUrl } from "@/lib/media-url";
import type {
  EditProfileResponse,
  PrivacySettingsResponse,
  Profile,
  UploadAvatarResponse,
} from "@/lib/types/api-types";

function normalizeProfile(
  profile: Profile & Record<string, unknown>,
): Profile {
  return {
    id: String(profile.id ?? profile.Id ?? ""),
    username: String(profile.username ?? profile.Username ?? ""),
    email: String(profile.email ?? profile.Email ?? ""),
    name: String(profile.name ?? profile.Name ?? ""),
    bio: (profile.bio ?? profile.Bio ?? null) as string | null,
    avatarColor: (profile.avatarColor ?? profile.AvatarColor ?? null) as
      | string
      | null,
    avatarImage: resolveBackendMediaUrl(
      (profile.avatarImage ?? profile.AvatarImage ?? null) as string | null,
    ) ?? null,
    privacy: (String(profile.privacy ?? profile.Privacy ?? "").toLowerCase() || "public"),
    showEmail: Boolean(profile.showEmail ?? profile.ShowEmail ?? false),
  };
}

export const getCurrentProfile = async () => {
  const profile = await api.get<Profile & Record<string, unknown>>("/profile/me");
  return normalizeProfile(profile);
};

export const updateCurrentProfile = async (data: {
  username?: string | null;
  name?: string | null;
  bio?: string | null;
  avatarColor?: string | null;
}) => {
  const response = await api.patch<EditProfileResponse & Record<string, unknown>>(
    "/profile/me",
    data,
  );
  return normalizeProfile(response as Profile & Record<string, unknown>);
};

export const uploadCurrentProfileAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.patch<UploadAvatarResponse & Record<string, unknown>>(
    "/profile/avatar",
    formData,
  );

  return {
    id: String(response.id ?? response.Id ?? ""),
    avatarImage:
      resolveBackendMediaUrl(
        (response.avatarImage ?? response.AvatarImage ?? null) as string | null,
      ) ?? null,
  };
};

export const deleteCurrentProfileAvatar = () =>
  api.delete<void>("/profile/avatar");

export const updatePrivacySettings = (data: {
  profileVisibility?: string | null;
  showEmail?: boolean | null;
}) => {
  const profileVisibility = data.profileVisibility
    ? data.profileVisibility.charAt(0).toUpperCase() + data.profileVisibility.slice(1)
    : data.profileVisibility;

  return api.patch<PrivacySettingsResponse>("/profile/privacy", {
    profileVisibility,
    showEmail: data.showEmail,
  });
};

export const deleteCurrentAccount = (password: string) =>
  api.delete<void>("/profile/me", { data: { password } });

export const requestEmailChange = (newEmail: string, password: string) =>
  api.patch<void>("/profile/email", { newEmail, password });
