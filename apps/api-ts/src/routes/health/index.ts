import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

const healthResponseSchema = z.object({
	env: z.enum(["development", "production", "test"]),
	status: z.literal("ok"),
});

const healthRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"",
		{
			logLevel: "silent",
			schema: {
				response: {
					200: healthResponseSchema,
				},
			},
		},
		async () => ({
			env: fastify.config.NODE_ENV,
			status: "ok" as const,
		}),
	);
};

export default healthRoutes;
