import path from "node:path";
import autoload from "@fastify/autoload";
import Fastify from "fastify";

import type { AppOptions } from "./app-options.js";

export type BuildServerOptions = AppOptions;

export function buildServer({ auth, config, logger }: BuildServerOptions) {
	const server = Fastify({
		bodyLimit: 1_048_576,
		forceCloseConnections: "idle",
		logger: logger ?? config.LOG_LEVEL !== "silent",
		onConstructorPoisoning: "error",
		onProtoPoisoning: "error",
		requestTimeout: 120_000,
		return503OnClosing: true,
		trustProxy: config.TRUST_PROXY,
	});

	server.register(autoload, {
		dir: path.join(import.meta.dirname, "plugins"),
		forceESM: true,
		options: { auth, config },
	});
	server.register(autoload, {
		autoHooks: true,
		cascadeHooks: true,
		dir: path.join(import.meta.dirname, "routes"),
		forceESM: true,
		routeParams: true,
	});

	return server;
}
