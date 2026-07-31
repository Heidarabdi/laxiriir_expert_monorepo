import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

const pingRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"",
		{
			schema: {
				response: {
					200: z.object({
						message: z.literal("pong"),
					}),
				},
			},
		},
		async () => ({
			message: "pong" as const,
		}),
	);
};

export default pingRoutes;
