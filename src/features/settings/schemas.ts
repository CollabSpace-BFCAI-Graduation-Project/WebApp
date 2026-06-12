import * as z from "zod";

export const profileSettingsSchema = z.object({
  displayName: z
    .string()
    .min(2, "at least 2 characters.")
    .max(20, "at most 20 characters."),
  username: z
    .string()
    .min(3, "at least 3 characters.")
    .max(20, "at most 20 characters."),
  email: z.string().email("Invalid email address."),
  bio: z.string().max(500, "Bio must be at most 500 characters.").optional(),
});

export type ProfileSettingsSchema = z.infer<typeof profileSettingsSchema>;
