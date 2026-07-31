import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

const currentUserSchema = z.object({
	allowedAreas: z.array(
		z.enum(["admin", "client", "expert", "expert_pending"]),
	),
	displayName: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	expertStatus: z.enum([
		"approved",
		"not_applicable",
		"pending_review",
		"rejected",
		"suspended",
	]),
	primaryRole: z.enum(["admin", "client", "expert"]),
	userId: z.string(),
});

const meRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!("requireSession" in fastify)) {
		return;
	}

	fastify.get(
		"",
		{
			schema: { response: { 200: currentUserSchema } },
		},
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply);
			if (!user) {
				return;
			}

			const allowedAreas =
				user.role === "admin"
					? (["admin"] as const)
					: user.role === "expert"
						? ([
								user.expertStatus === "approved"
									? "expert"
									: "expert_pending",
							] as const)
						: (["client"] as const);

			return {
				allowedAreas: [...allowedAreas],
				displayName: user.name,
				email: user.email,
				emailVerified: user.emailVerified,
				expertStatus: user.expertStatus,
				primaryRole: user.role,
				userId: user.id,
			};
		},
	);
};

export default meRoutes;
