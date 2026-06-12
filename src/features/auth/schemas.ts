import * as z from "zod";

export const registerFormSchema = z
  .object({
    fullName: z
      .string()
      .min(5, "Full name must be at least 5 characters.")
      .max(32, "Full name must be at most 32 characters."),

    username: z
      .string()
      .min(3, "Username must be at least 3 characters.")
      .max(25, "Username must be at most 25 characters.")
      .regex(/^[a-zA-Z0-9_-]+$/, "Only letters, numbers, underscores, and hyphens."),

    email: z.string().email("Please enter a valid email address."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(64, "Password must be at most 64 characters.")
      .regex(/[A-Z]/, "At least one uppercase letter.")
      .regex(/[0-9]/, "At least one number.")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        "At least one special character.",
      ),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerFormSchema>;

export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
