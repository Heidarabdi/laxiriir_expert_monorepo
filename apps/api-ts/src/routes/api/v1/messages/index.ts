import {
	bookingConversationParamsSchema,
	conversationListResponseSchema,
	conversationResponseSchema,
	markConversationReadResponseSchema,
	messageResponseSchema,
	sendMessageInputSchema,
	workspaceErrorResponseSchema,
} from "@repo/contracts/workspace";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import {
	ConversationNotFoundError,
	WorkspaceService,
} from "../../../../workspace/service.ts";

const messageRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;
	const workspace = new WorkspaceService(fastify.database);

	async function participant(request: Parameters<typeof fastify.requireSession>[0], reply: Parameters<typeof fastify.requireSession>[1]) {
		const user = await fastify.requireSession(request, reply, {
			requireVerified: true,
			roles: ["client", "expert"],
		});
		if (user?.role === "expert" && user.expertStatus !== "approved") {
			await reply.code(403).send({ message: "approved expert access required" });
			return null;
		}
		return user;
	}

	fastify.get(
		"",
		{ schema: { response: { 200: conversationListResponseSchema } } },
		async (request, reply) => {
			const user = await participant(request, reply);
			if (!user) return;
			return {
				conversations: await workspace.listConversations(user.id, user.role),
			};
		},
	);

	fastify.get(
		"/:bookingId",
		{
			schema: {
				params: bookingConversationParamsSchema,
				response: {
					200: conversationResponseSchema,
					404: workspaceErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const user = await participant(request, reply);
			if (!user) return;
			try {
				return await workspace.getConversation(
					user.id,
					user.role,
					request.params.bookingId,
				);
			} catch (error) {
				if (error instanceof ConversationNotFoundError) {
					return reply.code(404).send({ message: error.message });
				}
				throw error;
			}
		},
	);

	fastify.post(
		"/:bookingId",
		{
			schema: {
				body: sendMessageInputSchema,
				params: bookingConversationParamsSchema,
				response: {
					201: messageResponseSchema,
					404: workspaceErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const user = await participant(request, reply);
			if (!user) return;
			try {
				const message = await workspace.sendMessage(
					user.id,
					user.role,
					request.params.bookingId,
					request.body.body,
				);
				return reply.code(201).send({ message });
			} catch (error) {
				if (error instanceof ConversationNotFoundError) {
					return reply.code(404).send({ message: error.message });
				}
				throw error;
			}
		},
	);

	fastify.patch(
		"/:bookingId/read",
		{
			schema: {
				params: bookingConversationParamsSchema,
				response: {
					200: markConversationReadResponseSchema,
					404: workspaceErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const user = await participant(request, reply);
			if (!user) return;
			try {
				return {
					updatedCount: await workspace.markConversationRead(
						user.id,
						user.role,
						request.params.bookingId,
					),
				};
			} catch (error) {
				if (error instanceof ConversationNotFoundError) {
					return reply.code(404).send({ message: error.message });
				}
				throw error;
			}
		},
	);
};

export default messageRoutes;
