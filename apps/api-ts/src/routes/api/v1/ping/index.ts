import { pingResponseSchema } from "@repo/contracts/health";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const pingRoutes: FastifyPluginAsyncZod = async (fastify) => {
	fastify.get(
		"",
		{
			schema: {
				response: {
					200: pingResponseSchema,
				},
			},
		},
		async () => ({
			message: "pong" as const,
		}),
	);
};

export default pingRoutes;
