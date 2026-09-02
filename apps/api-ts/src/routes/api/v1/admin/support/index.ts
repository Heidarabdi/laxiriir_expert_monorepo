import {
	supportCaseListResponseSchema,
	supportCaseParamsSchema,
	supportCaseResponseSchema,
	updateSupportCaseInputSchema,
	workspaceErrorResponseSchema,
} from "@repo/contracts/workspace";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import {
	SupportCaseNotFoundError,
	WorkspaceService,
} from "../../../../../workspace/service.ts";

const adminSupportRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;
	const workspace = new WorkspaceService(fastify.database);

	fastify.get(
		"",
		{ schema: { response: { 200: supportCaseListResponseSchema } } },
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["admin"],
			});
			if (!user) return;
			return { cases: await workspace.listSupportCases() };
		},
	);

	fastify.patch(
		"/:id",
		{
			schema: {
				body: updateSupportCaseInputSchema,
				params: supportCaseParamsSchema,
				response: {
					200: supportCaseResponseSchema,
					404: workspaceErrorResponseSchema,
				},
			},
		},
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
				roles: ["admin"],
			});
			if (!user) return;
			try {
				return {
					case: await workspace.updateSupportCase(
						user.id,
						request.params.id,
						request.body,
					),
				};
			} catch (error) {
				if (error instanceof SupportCaseNotFoundError) {
					return reply.code(404).send({ message: error.message });
				}
				throw error;
			}
		},
	);
};

export default adminSupportRoutes;
