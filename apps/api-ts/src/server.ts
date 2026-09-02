import path from "node:path";
import { fileURLToPath } from "node:url";
import autoload from "@fastify/autoload";
import Fastify, { LogController } from "fastify";

import type { AppOptions } from "./app-options.js";

export type BuildServerOptions = AppOptions;

export function buildServer({ auth, config, database, logger }: BuildServerOptions) {
	const sourceDirectory = fileURLToPath(new URL(".", import.meta.url));
	const server = Fastify({
		bodyLimit: 1_048_576,
		forceCloseConnections: "idle",
		logController: new LogController({ disableRequestLogging: true }),
		logger: logger ?? config.LOG_LEVEL !== "silent",
		onConstructorPoisoning: "error",
		onProtoPoisoning: "error",
		requestTimeout: 120_000,
		return503OnClosing: true,
		trustProxy: config.TRUST_PROXY,
	});
	const requestErrors = new WeakMap<object, Error>();

	server.addHook("onError", async (request, _reply, error) => {
		requestErrors.set(request, error);
	});
	server.addHook("onResponse", async (request, reply) => {
		const responseTime = Math.round(reply.elapsedTime);
		const context = {
			method: request.method,
			responseTime,
			statusCode: reply.statusCode,
			url: request.url,
		};
		const message = `${request.method} ${request.url} → ${reply.statusCode} (${responseTime} ms)`;
		const error = requestErrors.get(request);
		if (error) {
			request.log.error({ ...context, err: error }, message);
			return;
		}
		if (reply.statusCode >= 500) {
			request.log.error(context, message);
			return;
		}
		if (reply.statusCode >= 400) {
			request.log.warn(context, message);
			return;
		}
		request.log.info(context, message);
	});

	server.register(autoload, {
		dir: path.join(sourceDirectory, "plugins"),
		forceESM: true,
		options: { auth, config, database },
	});
	server.register(autoload, {
		autoHooks: true,
		cascadeHooks: true,
		dir: path.join(sourceDirectory, "routes"),
		forceESM: true,
		routeParams: true,
	});

	return server;
}
