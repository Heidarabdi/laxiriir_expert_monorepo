import { z } from "zod";

const DEFAULT_API_BASE_URL = "http://localhost:8081";

const webEnvSchema = z.object({
	VITE_API_BASE_URL: z.string().url().default(DEFAULT_API_BASE_URL),
});

export const webEnv = webEnvSchema.parse({
	VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
});

export type WebEnv = typeof webEnv;
