import { z } from "zod";

const optionalImage = z.union([
  z.literal(""),
  z.string().url().max(1000).refine((value) => /^https?:\/\//i.test(value), "Image URL must use HTTP or HTTPS")
]).optional().default("");

export const registerSchema = z.object({
  username: z.string().trim().min(3).max(24).regex(/^[a-zA-Z0-9_-]+$/, "Use letters, numbers, _ or -"),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72)
});
export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(72)
});
export const postSchema = z.object({
  title: z.string().trim().min(4).max(120),
  excerpt: z.string().trim().max(240).optional().default(""),
  content: z.string().trim().min(30).max(30000),
  tags: z.array(z.string().trim().min(1).max(24)).max(8).optional().default([]),
  coverImage: optionalImage
});
export const commentSchema = z.object({
  text: z.string().trim().min(2).max(1200)
});
