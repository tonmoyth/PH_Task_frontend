import { z } from "zod";

export const createMentorSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name cannot exceed 60 characters"),
  email: z.string().trim().min(1, "Email is required").email("Please enter a valid email"),
});

export type CreateMentorInput = z.infer<typeof createMentorSchema>;
