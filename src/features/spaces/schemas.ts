import { z } from "zod";
import { vibes } from "./constants";

export const createSpaceSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  description: z
    .string()
    .min(2, "Description must be at least 2 characters")
    .max(200, "Description must be at most 200 characters"),
  vibe: z.enum(vibes.map((v) => v.name)).nullable(),
});

export type CreateSpaceFormValues = z.infer<typeof createSpaceSchema>;
