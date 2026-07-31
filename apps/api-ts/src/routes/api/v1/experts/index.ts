import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { ConsultationService } from "../../../../consultations/service.ts";
import { availabilitySchema, expertSchema } from "./schema.ts";

const expertRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database) {
		return;
	}

	const consultations = new ConsultationService(fastify.database);

	fastify.get(
		"",
		{
			schema: {
				response: {
					200: z.object({ experts: z.array(expertSchema) }),
				},
			},
		},
		async () => ({ experts: await consultations.listExperts() }),
	);

	fastify.get(
		"/:id/availability",
		{
			schema: {
				params: z.object({ id: z.string().trim().min(1) }),
				response: {
					200: z.object({ slots: z.array(availabilitySchema) }),
				},
			},
		},
		async (request) => ({
			slots: await consultations.listAvailability(request.params.id),
		}),
	);
};

export default expertRoutes;
