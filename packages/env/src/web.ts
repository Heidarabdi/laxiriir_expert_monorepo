import { z } from "zod";

const DEFAULT_API_BASE_URL = "http://localhost:8080";

const webEnvSchema = z.object({
	NUXT_PUBLIC_API_BASE_URL: z.string().url().default(DEFAULT_API_BASE_URL),
});

export const webEnv = webEnvSchema.parse({
	NUXT_PUBLIC_API_BASE_URL: process.env.NUXT_PUBLIC_API_BASE_URL,
});

export type WebEnv = typeof webEnv;
