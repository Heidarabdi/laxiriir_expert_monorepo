import type { ExpertStatus, PrimaryRole } from "@repo/contracts/auth";
import { fromNodeHeaders } from "better-auth/node";
import type { FastifyPluginAsync, FastifyReply, FastifyRequest } from "fastify";
import fastifyPlugin from "fastify-plugin";

import type { AppOptions } from "../app-options.js";

export type { ExpertStatus, PrimaryRole } from "@repo/contracts/auth";

export interface AuthenticatedUser {
	email: string;
	emailVerified: boolean;
	expertStatus: ExpertStatus;
	id: string;
	name: string;
	role: PrimaryRole;
}

export interface SessionRequirements {
	requireVerified?: boolean;
	roles?: PrimaryRole[];
}

declare module "fastify" {
	interface FastifyInstance {
		requireSession: (
			request: FastifyRequest,
			reply: FastifyReply,
			requirements?: SessionRequirements,
		) => Promise<AuthenticatedUser | null>;
	}
}

const authPlugin: FastifyPluginAsync<AppOptions> = async (fastify, options) => {
	if (!options.auth) {
		return;
	}

	const auth = options.auth;

	fastify.decorate(
		"requireSession",
		async (
			request: FastifyRequest,
			reply: FastifyReply,
			requirements: SessionRequirements = {},
		) => {
			const session = await auth.api.getSession({
				headers: fromNodeHeaders(request.headers),
			});
			if (!session) {
				await reply.code(401).send({ message: "unauthorized" });
				return null;
			}

			const sessionUser = session.user as AuthenticatedUser;
			const user: AuthenticatedUser =
				options.config.NODE_ENV === "development"
					? {
							...sessionUser,
							emailVerified: true,
							expertStatus:
								sessionUser.role === "expert" &&
								sessionUser.expertStatus === "pending_review"
									? "approved"
									: sessionUser.expertStatus,
						}
					: sessionUser;

			if (requirements.requireVerified && !user.emailVerified) {
				await reply.code(403).send({ message: "email verification required" });
				return null;
			}
			if (requirements.roles && !requirements.roles.includes(user.role)) {
				await reply.code(403).send({ message: "forbidden" });
				return null;
			}

			return user;
		},
	);

	fastify.route({
		handler: async (request, reply) => {
			const url = new URL(request.url, options.config.BETTER_AUTH_URL);

			const response = await auth.handler(
				new Request(url, {
					body:
						request.body === undefined
							? undefined
							: JSON.stringify(request.body),
					headers: fromNodeHeaders(request.headers),
					method: request.method,
				}),
			);

			reply.status(response.status);
			response.headers.forEach((value, name) => {
				if (name !== "set-cookie") {
					reply.header(name, value);
				}
			});
			const cookies = response.headers.getSetCookie();
			if (cookies.length > 0) {
				reply.header("set-cookie", cookies);
			}

			const body = response.body ? await response.text() : null;
			return reply.send(body);
		},
		method: ["GET", "POST"],
		url: "/api/auth/*",
	});
};

export default fastifyPlugin(authPlugin, {
	fastify: "5.x",
	name: "auth",
});
