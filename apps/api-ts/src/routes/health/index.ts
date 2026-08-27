import { healthResponseSchema } from "@repo/contracts/health";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

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
