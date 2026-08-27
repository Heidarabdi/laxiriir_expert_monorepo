import {
	availabilityListResponseSchema,
	expertListResponseSchema,
	expertParamsSchema,
} from "@repo/contracts/consultations";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { ConsultationService } from "../../../../consultations/service.ts";

const expertRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database) {
		return;
	}

	const consultations = new ConsultationService(fastify.database, {
		allowPendingExperts: fastify.config.NODE_ENV === "development",
	});

	fastify.get(
		"",
		{
			schema: {
				response: {
					200: expertListResponseSchema,
				},
			},
		},
		async () => ({ experts: await consultations.listExperts() }),
	);

	fastify.get(
		"/:id/availability",
		{
			schema: {
				params: expertParamsSchema,
				response: {
					200: availabilityListResponseSchema,
				},
			},
		},
		async (request) => ({
			slots: await consultations.listAvailability(request.params.id),
		}),
	);
};

export default expertRoutes;
