import {
	accountProfileInputSchema,
	currentUserSchema,
} from "@repo/contracts/auth";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { user as userTable } from "../../../../db/auth-schema.ts";

function allowedAreasFor(user: { expertStatus: string; role: string }) {
	return user.role === "admin"
		? (["admin"] as const)
		: user.role === "expert"
			? ([
					user.expertStatus === "approved" ? "expert" : "expert_pending",
				] as const)
			: (["client"] as const);
}

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

			return {
				allowedAreas: [...allowedAreasFor(user)],
				displayName: user.name,
				email: user.email,
				emailVerified: user.emailVerified,
				expertStatus: user.expertStatus,
				primaryRole: user.role,
				userId: user.id,
			};
		},
	);

	fastify.patch(
		"",
		{
			schema: {
				body: accountProfileInputSchema,
				response: { 200: currentUserSchema },
			},
		},
		async (request, reply) => {
			const sessionUser = await fastify.requireSession(request, reply, {
				requireVerified: true,
			});
			if (!sessionUser || !fastify.database) return;

			const [updated] = await fastify.database
				.update(userTable)
				.set({ name: request.body.displayName })
				.where(eq(userTable.id, sessionUser.id))
				.returning({ name: userTable.name });

			return {
				allowedAreas: [...allowedAreasFor(sessionUser)],
				displayName: updated.name,
				email: sessionUser.email,
				emailVerified: sessionUser.emailVerified,
				expertStatus: sessionUser.expertStatus,
				primaryRole: sessionUser.role,
				userId: sessionUser.id,
			};
		},
	);
};

export default meRoutes;
