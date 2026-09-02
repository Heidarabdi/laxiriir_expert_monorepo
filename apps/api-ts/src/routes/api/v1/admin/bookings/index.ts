import { adminBookingListResponseSchema } from "@repo/contracts/consultations";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { ConsultationService } from "../../../../../consultations/service.ts";

const adminBookingRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;
	const consultations = new ConsultationService(fastify.database);

	fastify.get(
		"",
		{ schema: { response: { 200: adminBookingListResponseSchema } } },
		async (request, reply) => {
			const admin = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["admin"],
			});
			if (!admin) return;
			return { bookings: await consultations.listAdminBookings() };
		},
	);
};

export default adminBookingRoutes;
