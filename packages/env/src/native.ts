import { z } from "zod";

const DEFAULT_API_BASE_URL = "http://localhost:8080";

const nativeEnvSchema = z.object({
	EXPO_PUBLIC_API_BASE_URL: z.string().url().default(DEFAULT_API_BASE_URL),
});

export const nativeEnv = nativeEnvSchema.parse({
	EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
});

export type NativeEnv = typeof nativeEnv;
