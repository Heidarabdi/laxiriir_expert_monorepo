import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import {
	AvailabilityConflictError,
	AvailabilityNotFoundError,
	BookedAvailabilityError,
	ConsultationService,
} from "../../../../../consultations/service.ts";
import {
	availabilityInputSchema,
	availabilityParamsSchema,
	availabilitySlotSchema,
} from "./schema.ts";

const expertAvailabilityRoutes: FastifyPluginAsyncZod = async (fastify) => {
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

	function throwAvailabilityError(error: unknown): never {
		if (error instanceof AvailabilityNotFoundError) {
			throw fastify.httpErrors.notFound(error.message);
		}
		if (
			error instanceof AvailabilityConflictError ||
			error instanceof BookedAvailabilityError
		) {
			throw fastify.httpErrors.conflict(error.message);
		}
		throw error;
	}

	fastify.get(
		"",
		{
			schema: {
				response: {
					200: z.object({ slots: z.array(availabilitySlotSchema) }),
				},
			},
		},
		async (request, reply) => {
			const expert = await requireApprovedExpert(request, reply);
			if (!expert) return;
			return { slots: await consultations.listExpertAvailability(expert.id) };
		},
	);

	fastify.post(
		"",
		{
			schema: {
				body: availabilityInputSchema,
				response: { 201: z.object({ slot: availabilitySlotSchema }) },
			},
		},
		async (request, reply) => {
			const expert = await requireApprovedExpert(request, reply);
			if (!expert) return;
			try {
				const slot = await consultations.createAvailability(
					expert.id,
					new Date(request.body.startsAt),
					new Date(request.body.endsAt),
				);
				return reply.code(201).send({ slot });
			} catch (error) {
				throwAvailabilityError(error);
			}
		},
	);

	fastify.patch(
		"/:id",
		{
			schema: {
				body: availabilityInputSchema,
				params: availabilityParamsSchema,
				response: { 200: z.object({ slot: availabilitySlotSchema }) },
			},
		},
		async (request, reply) => {
			const expert = await requireApprovedExpert(request, reply);
			if (!expert) return;
			try {
				return {
					slot: await consultations.updateAvailability(
						expert.id,
						request.params.id,
						new Date(request.body.startsAt),
						new Date(request.body.endsAt),
					),
				};
			} catch (error) {
				throwAvailabilityError(error);
			}
		},
	);

	fastify.delete(
		"/:id",
		{
			schema: {
				params: availabilityParamsSchema,
				response: { 204: z.null() },
			},
		},
		async (request, reply) => {
			const expert = await requireApprovedExpert(request, reply);
			if (!expert) return;
			try {
				await consultations.deleteAvailability(expert.id, request.params.id);
				return reply.code(204).send(null);
			} catch (error) {
				throwAvailabilityError(error);
			}
		},
	);
};

export default expertAvailabilityRoutes;
