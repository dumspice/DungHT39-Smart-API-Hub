import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Email is invalid",
  }),
  password: z.string().min(6, "Password must be 6 characters length"),
  role: z.enum(["user", "admin"]).optional(),
});

export const loginSchema = z.object({
  email: z.string().refine((val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Email is invalid",
  }),
  password: z.string().min(1, "Password cannot empty"),
});
