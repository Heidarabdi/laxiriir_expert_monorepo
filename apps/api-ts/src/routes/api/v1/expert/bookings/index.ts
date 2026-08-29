import {
	expertBookingListResponseSchema,
	expertBookingQuerySchema,
	expertDashboardSummarySchema,
} from "@repo/contracts/consultations";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { ConsultationService } from "../../../../../consultations/service.ts";

const expertBookingRoutes: FastifyPluginAsyncZod = async (fastify) => {
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

	fastify.get(
		"",
		{
			schema: {
				querystring: expertBookingQuerySchema,
				response: { 200: expertBookingListResponseSchema },
			},
		},
		async (request, reply) => {
			const expert = await requireApprovedExpert(request, reply);
			if (!expert) return;
			return {
				bookings: await consultations.listExpertBookings(
					expert.id,
					request.query.scope,
				),
			};
		},
	);

	fastify.get(
		"/summary",
		{
			schema: {
				response: { 200: expertDashboardSummarySchema },
			},
		},
		async (request, reply) => {
			const expert = await requireApprovedExpert(request, reply);
			if (!expert) return;
			return consultations.getExpertDashboardSummary(expert.id);
		},
	);
};

export default expertBookingRoutes;
