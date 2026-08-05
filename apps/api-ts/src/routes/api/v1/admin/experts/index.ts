import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { user as userTable } from "../../../../../db/auth-schema.ts";

const statusByAction = {
	approve: "approved",
	reject: "rejected",
	suspend: "suspended",
} as const;

const messageByAction = {
	approve: "expert approved",
	reject: "expert rejected",
	suspend: "expert suspended",
} as const;

const profileSchema = z.object({
	createdAt: z.string().datetime(),
	displayName: z.string(),
	email: z.string().email(),
	expertStatus: z.enum(["approved", "rejected", "suspended"]),
	identityUserId: z.string(),
	primaryRole: z.literal("expert"),
	updatedAt: z.string().datetime(),
});

const adminExpertRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;
	const database = fastify.database;

	fastify.patch(
		"/:id/:action",
		{
			schema: {
				params: z.object({
					action: z.enum(["approve", "reject", "suspend"]),
					id: z.string().trim().min(1),
				}),
				response: {
					200: z.object({ message: z.string(), profile: profileSchema }),
					404: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const admin = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["admin"],
			});
			if (!admin) return;

			const [expert] = await database
				.update(userTable)
				.set({ expertStatus: statusByAction[request.params.action] })
				.where(
					and(
						eq(userTable.id, request.params.id),
						eq(userTable.role, "expert"),
					),
				)
				.returning();
			if (!expert) {
				return reply.code(404).send({ message: "expert profile not found" });
			}

			return {
				message: messageByAction[request.params.action],
				profile: {
					createdAt: expert.createdAt.toISOString(),
					displayName: expert.name,
					email: expert.email,
					expertStatus: statusByAction[request.params.action],
					identityUserId: expert.id,
					primaryRole: "expert" as const,
					updatedAt: expert.updatedAt.toISOString(),
				},
			};
		},
	);
};

export default adminExpertRoutes;
