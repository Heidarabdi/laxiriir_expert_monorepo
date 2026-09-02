import {
	errorResponseSchema,
	expertProfileInputSchema,
	expertResponseSchema,
} from "@repo/contracts/consultations";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import {
	ConsultationService,
	ExpertProfileNotFoundError,
} from "../../../../../consultations/service.ts";

const expertProfileRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;
	const consultations = new ConsultationService(fastify.database);

	async function requireApprovedExpert(
		request: Parameters<typeof fastify.requireSession>[0],
		reply: Parameters<typeof fastify.requireSession>[1],
	) {
		const expert = await fastify.requireSession(request, reply, {
			requireVerified: true,
			roles: ["expert"],
		});
		if (!expert) return null;
		if (expert.expertStatus !== "approved") {
			await reply.code(403).send({ message: "expert approval required" });
			return null;
		}
		return expert;
	}

	function throwProfileError(error: unknown): never {
		if (error instanceof ExpertProfileNotFoundError) {
			throw fastify.httpErrors.notFound(error.message);
		}
		throw error;
	}

	fastify.get(
		"",
		{
			schema: {
				response: { 200: expertResponseSchema, 404: errorResponseSchema },
			},
		},
		async (request, reply) => {
			const identity = await requireApprovedExpert(request, reply);
			if (!identity) return;
			try {
				return { expert: await consultations.getExpertProfile(identity.id) };
			} catch (error) {
				throwProfileError(error);
			}
		},
	);

	fastify.patch(
		"",
		{
			schema: {
				body: expertProfileInputSchema,
				response: { 200: expertResponseSchema, 404: errorResponseSchema },
			},
		},
		async (request, reply) => {
			const identity = await requireApprovedExpert(request, reply);
			if (!identity) return;
			try {
				return {
					expert: await consultations.updateExpertProfile(
						identity.id,
						request.body,
					),
				};
			} catch (error) {
				throwProfileError(error);
			}
		},
	);
};

export default expertProfileRoutes;
