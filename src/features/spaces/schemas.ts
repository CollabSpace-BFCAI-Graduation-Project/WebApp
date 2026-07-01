import { z } from "zod";

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(200, "Description must be at most 200 characters"),
  privacy: z.enum(["Private", "Public"]),
  vibe: z.enum(["Art Gallery", "Cyber Lab", "Cozy Lounge", "Classroom"]).nullable(),
  thumbnail: z.instanceof(typeof window !== "undefined" ? File : Object).nullable().optional(),
});

export type CreateSpaceFormValues = z.infer<typeof createSpaceSchema>;
