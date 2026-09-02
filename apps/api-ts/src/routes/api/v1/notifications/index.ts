import {
	engagementErrorResponseSchema,
	markAllNotificationsReadResponseSchema,
	notificationListResponseSchema,
	notificationParamsSchema,
	notificationResponseSchema,
} from "@repo/contracts/engagements";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import {
	EngagementService,
	NotificationNotFoundError,
} from "../../../../engagements/service.ts";

const notificationRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;

	const engagements = new EngagementService(fastify.database);

	fastify.get(
		"",
		{ schema: { response: { 200: notificationListResponseSchema } } },
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
			});
			if (!user) return;
			return engagements.listNotifications(user.id);
		},
	);

	fastify.patch(
		"/read-all",
		{
			schema: {
				response: { 200: markAllNotificationsReadResponseSchema },
			},
		},
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
			});
			if (!user) return;
			return {
				updatedCount: await engagements.markAllNotificationsRead(user.id),
			};
		},
	);

	fastify.patch(
		"/:id",
		{
			schema: {
				params: notificationParamsSchema,
				response: {
					200: notificationResponseSchema,
					404: engagementErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
			});
			if (!user) return;
			try {
				return {
					notification: await engagements.markNotificationRead(
						user.id,
						request.params.id,
					),
				};
			} catch (error) {
				if (error instanceof NotificationNotFoundError) {
					return reply.code(404).send({ message: error.message });
				}
				throw error;
			}
		},
	);
};

export default notificationRoutes;
