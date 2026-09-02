import {
	workspacePreferencesResponseSchema,
	workspacePreferencesSchema,
} from "@repo/contracts/workspace";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { WorkspaceService } from "../../../../workspace/service.ts";

const settingsRoutes: FastifyPluginAsyncZod = async (fastify) => {
	if (!fastify.database || !("requireSession" in fastify)) return;
	const workspace = new WorkspaceService(fastify.database);

	fastify.get(
		"",
		{ schema: { response: { 200: workspacePreferencesResponseSchema } } },
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
			});
			if (!user) return;
			return { preferences: await workspace.getPreferences(user.id) };
		},
	);

	fastify.patch(
		"",
		{
			schema: {
				body: workspacePreferencesSchema,
				response: { 200: workspacePreferencesResponseSchema },
			},
		},
		async (request, reply) => {
			const user = await fastify.requireSession(request, reply, {
				requireVerified: true,
			});
			if (!user) return;
			return {
				preferences: await workspace.updatePreferences(user.id, request.body),
			};
		},
	);
};

export default settingsRoutes;
