import { z } from "zod/v3";

export const resourceSchemas: Record<string, z.ZodObject<any>> = {
  posts: z.object({
    title: z.string().min(5, "Title must be greater than 5 character length"),
    content: z
      .string()
      .min(10, "Content must be greater than 10 character length"),
    userId: z.number().int(),
  }),
  comments: z.object({
    content: z
      .string()
      .min(10, "Content must be greater than 10 character length"),
    postId: z.number().int(),
  }),
  rating: z.object({
    userId: z.number().int(),
    score: z.number().int(),
  }),
  blog: z.object({
    title: z.string().min(5, "Title must be greater than 5 character length"),
    content: z
      .string()
      .min(10, "Content must be greater than 10 character length"),
    userId: z.number().int(),
  }),
  category: z.object({
    name: z.string().min(1, "Category name is required"),
  }),
};
