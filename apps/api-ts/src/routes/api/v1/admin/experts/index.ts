import {
	adminExpertListResponseSchema,
	expertStatusActionParamsSchema,
	expertStatusUpdateResponseSchema,
} from "@repo/contracts/auth";
import { errorResponseSchema } from "@repo/contracts/consultations";
import { and, asc, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

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

const adminExpertRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;
	const database = fastify.database;

	fastify.get(
		"/",
		{ schema: { response: { 200: adminExpertListResponseSchema } } },
		async (request, reply) => {
			const admin = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["admin"],
			});
			if (!admin) return;

			const identities = await database
				.select()
				.from(userTable)
				.where(eq(userTable.role, "expert"))
				.orderBy(asc(userTable.createdAt));

			return {
				experts: identities.map((identity) => ({
					createdAt: identity.createdAt.toISOString(),
					displayName: identity.name,
					email: identity.email,
					expertStatus: identity.expertStatus as
						| "pending_review"
						| "approved"
						| "rejected"
						| "suspended",
					identityUserId: identity.id,
					updatedAt: identity.updatedAt.toISOString(),
				})),
			};
		},
	);

	fastify.patch(
		"/:id/:action",
		{
			schema: {
				params: expertStatusActionParamsSchema,
				response: {
					200: expertStatusUpdateResponseSchema,
					404: errorResponseSchema,
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
					const now = new Date();
					await transaction
						.insert(experts)
						.values({
							active: true,
							avatarUrl: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(identity.name)}`,
							bio: "Newly approved expert profile.",
							category: "General",
							createdAt: now,
							displayName: identity.name,
							hourlyRateCents: 0,
							id: identity.id,
							title: "Consultation Expert",
							updatedAt: now,
						})
						.onConflictDoUpdate({
							set: {
								active: true,
								displayName: identity.name,
								updatedAt: now,
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
