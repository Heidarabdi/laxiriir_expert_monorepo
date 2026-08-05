import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

import { user as userTable } from "../../../../../db/auth-schema.ts";
import { experts } from "../../../../../db/consultation-schema.ts";

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

			const expert = await database.transaction(async (transaction) => {
				const [identity] = await transaction
					.update(userTable)
					.set({ expertStatus: statusByAction[request.params.action] })
					.where(
						and(
							eq(userTable.id, request.params.id),
							eq(userTable.role, "expert"),
						),
					)
					.returning();
				if (!identity) return null;

				if (request.params.action === "approve") {
					await transaction
						.insert(experts)
						.values({
							active: true,
							avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(identity.name)}`,
							bio: "Newly approved expert profile.",
							category: "General",
							displayName: identity.name,
							hourlyRateCents: 0,
							id: identity.id,
							title: "Consultation Expert",
							updatedAt: new Date(),
						})
						.onConflictDoUpdate({
							set: {
								active: true,
								displayName: identity.name,
								updatedAt: new Date(),
							},
							target: experts.id,
						});
				} else {
					await transaction
						.update(experts)
						.set({ active: false, updatedAt: new Date() })
						.where(eq(experts.id, identity.id));
				}

				return identity;
			});
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
