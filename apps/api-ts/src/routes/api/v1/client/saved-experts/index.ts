import {
	engagementErrorResponseSchema,
	savedExpertListResponseSchema,
	savedExpertParamsSchema,
	savedExpertResponseSchema,
} from "@repo/contracts/engagements";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import {
	EngagementService,
	ExpertUnavailableError,
} from "../../../../../engagements/service.ts";

const savedExpertRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;

	const engagements = new EngagementService(fastify.database, {
		allowPendingExperts: fastify.config.NODE_ENV === "development",
	});

	fastify.get(
		"",
		{ schema: { response: { 200: savedExpertListResponseSchema } } },
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["client"],
			});
			if (!user) return;
			return { savedExperts: await engagements.listSavedExperts(user.id) };
		},
	);

	fastify.put(
		"/:expertId",
		{
			schema: {
				params: savedExpertParamsSchema,
				response: {
					200: savedExpertResponseSchema,
					404: engagementErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["client"],
			});
			if (!user) return;
			try {
				return {
					savedExpert: await engagements.saveExpert(
						user.id,
						request.params.expertId,
					),
				};
			} catch (error) {
				if (error instanceof ExpertUnavailableError) {
					return reply.code(404).send({ message: error.message });
				}
				throw error;
			}
		},
	);

	fastify.delete(
		"/:expertId",
		{ schema: { params: savedExpertParamsSchema } },
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["client"],
			});
			if (!user) return;
			await engagements.removeSavedExpert(user.id, request.params.expertId);
			return reply.code(204).send();
		},
	);
};

export default savedExpertRoutes;
