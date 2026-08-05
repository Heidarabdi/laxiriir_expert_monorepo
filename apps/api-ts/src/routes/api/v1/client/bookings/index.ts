import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import {
	BookingChangeConflictError,
	BookingNotFoundError,
	ConsultationService,
	SlotUnavailableError,
} from "../../../../../consultations/service.ts";
import {
	bookingParamsSchema,
	bookingSchema,
	errorSchema,
} from "./schema.ts";

const bookingRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) {
		return;
	}

	const consultations = new ConsultationService(fastify.database);

	fastify.get(
		"",
		{
			schema: {
				response: { 200: z.object({ bookings: z.array(bookingSchema) }) },
			},
		},
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["client"],
			});
			if (!user) return;
			return { bookings: await consultations.listClientBookings(user.id) };
		},
	);

	fastify.post(
		"",
		{
			schema: {
				body: z.object({ availabilitySlotId: z.number().int().positive() }),
				response: {
					201: z.object({ booking: bookingSchema }),
					409: errorSchema,
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
				const booking = await consultations.createBooking(
					user.id,
					request.body.availabilitySlotId,
				);
				return reply.code(201).send({ booking });
			} catch (error) {
				if (error instanceof SlotUnavailableError) {
					return reply.code(409).send({ message: error.message });
				}
				throw error;
			}
		},
	);

	fastify.delete(
		"/:id",
		{
			schema: {
				params: bookingParamsSchema,
				response: {
					200: z.object({ booking: bookingSchema }),
					404: errorSchema,
					409: errorSchema,
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
				const booking = await consultations.cancelBooking(
					user.id,
					request.params.id,
				);
				return { booking };
			} catch (error) {
				if (error instanceof BookingNotFoundError) {
					return reply.code(404).send({ message: error.message });
				}
				if (error instanceof BookingChangeConflictError) {
					return reply.code(409).send({ message: error.message });
				}
				throw error;
			}
		},
	);

	fastify.patch(
		"/:id",
		{
			schema: {
				body: z.object({ availabilitySlotId: z.number().int().positive() }),
				params: bookingParamsSchema,
				response: {
					200: z.object({ booking: bookingSchema }),
					404: errorSchema,
					409: errorSchema,
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
				const booking = await consultations.rescheduleBooking(
					user.id,
					request.params.id,
					request.body.availabilitySlotId,
				);
				return { booking };
			} catch (error) {
				if (error instanceof BookingNotFoundError) {
					return reply.code(404).send({ message: error.message });
				}
				if (error instanceof BookingChangeConflictError) {
					return reply.code(409).send({ message: error.message });
				}
				throw error;
			}
		},
	);
};

export default bookingRoutes;
