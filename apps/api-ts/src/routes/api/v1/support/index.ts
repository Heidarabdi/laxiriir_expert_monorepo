import {
	createSupportCaseInputSchema,
	supportCaseListResponseSchema,
	supportCaseResponseSchema,
	workspaceErrorResponseSchema,
} from "@repo/contracts/workspace";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import {
	ConversationNotFoundError,
	WorkspaceService,
} from "../../../../workspace/service.ts";

const supportRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;
	const workspace = new WorkspaceService(fastify.database);

	fastify.get(
		"",
		{ schema: { response: { 200: supportCaseListResponseSchema } } },
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["client", "expert"],
			});
			if (!user) return;
			return { cases: await workspace.listSupportCases(user.id) };
		},
	);

	fastify.post(
		"",
		{
			schema: {
				body: createSupportCaseInputSchema,
				response: {
					201: supportCaseResponseSchema,
					404: workspaceErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["client", "expert"],
			});
			if (!user) return;
			try {
				const supportCase = await workspace.createSupportCase(
					user.id,
					user.role,
					request.body,
				);
				return reply.code(201).send({ case: supportCase });
			} catch (error) {
				if (error instanceof ConversationNotFoundError) {
					return reply.code(404).send({ message: error.message });
				}
				throw error;
			}
		},
	);
};

export default supportRoutes;
