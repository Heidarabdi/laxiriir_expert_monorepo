import { z } from "zod";

export const healthResponseSchema = z.object({
	env: z.enum(["development", "production", "test"]),
	status: z.literal("ok"),
});
export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const pingResponseSchema = z.object({
	message: z.literal("pong"),
});
export type PingResponse = z.infer<typeof pingResponseSchema>;
