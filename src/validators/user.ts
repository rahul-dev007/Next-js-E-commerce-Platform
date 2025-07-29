import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2),
  image: z.string().url().optional(),
});

export const changeRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(["user", "admin"]),
});
