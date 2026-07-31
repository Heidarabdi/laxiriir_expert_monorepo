import type { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

import type { AppOptions } from "../app-options.js";

const authPlugin: FastifyPluginAsync<AppOptions> = async (fastify, options) => {
	if (!options.auth) {
		return;
	}

	const auth = options.auth;

	fastify.route({
		handler: async (request, reply) => {
			const url = new URL(request.url, options.config.BETTER_AUTH_URL);
			const headers = new Headers();

			for (const [name, value] of Object.entries(request.headers)) {
				if (value !== undefined) {
					headers.set(name, Array.isArray(value) ? value.join(",") : value);
				}
			}

			const response = await auth.handler(
				new Request(url, {
					body:
						request.body === undefined
							? undefined
							: JSON.stringify(request.body),
					headers,
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
