import { adminUserListResponseSchema } from "@repo/contracts/auth";
import { asc } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { user } from "../../../../../db/auth-schema.ts";

const adminUserRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;
	const database = fastify.database;

	fastify.get(
		"",
		{ schema: { response: { 200: adminUserListResponseSchema } } },
		async (request, reply) => {
			const admin = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["admin"],
			});
			if (!admin) return;
			const users = await database
				.select()
				.from(user)
				.orderBy(asc(user.createdAt));
			return {
				users: users.map((identity) => ({
					createdAt: identity.createdAt.toISOString(),
					displayName: identity.name,
					email: identity.email,
					emailVerified: identity.emailVerified,
					expertStatus: identity.expertStatus as
						| "not_applicable"
						| "pending_review"
						| "approved"
						| "rejected"
						| "suspended",
					id: identity.id,
					primaryRole: identity.role as "client" | "expert" | "admin",
					updatedAt: identity.updatedAt.toISOString(),
				})),
			};
		},
	);
};

export default adminUserRoutes;
