import { z } from "zod/v3";

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

export const formatZodError = (error: any) => {
  const formatted = error.format();
  const result: Record<string, string> = {};
  for (const key in formatted) {
    if (key !== "_errors") {
      result[key] = formatted[key]?._errors?.[0];
    }
  }
  return result;
};
