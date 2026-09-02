import type { FastifyServerOptions } from "fastify";

import type { ApiConfig } from "./config.js";

const redaction = {
	censor: "[Redacted]",
	paths: [
		"req.body.password",
		"req.body.token",
		"req.headers.authorization",
		"req.headers.cookie",
		"res.headers.set-cookie",
	],
};

function developmentError(error: unknown) {
	const outer = error instanceof Error ? error : new Error(String(error));
	const cause = outer.cause instanceof Error ? outer.cause : outer;
	return {
		code: "code" in cause ? String(cause.code) : undefined,
		message: cause.message,
		stack: `${outer.name}: ${cause.message}`,
		type: outer.name,
	};
}

export function createLoggerOptions(
	config: ApiConfig,
): FastifyServerOptions["logger"] {
	if (config.LOG_LEVEL === "silent") return false;

	const base = {
		level: config.LOG_LEVEL,
		redact: redaction,
	};

	if (config.NODE_ENV !== "development") return base;

	return {
		...base,
		serializers: { err: developmentError },
		transport: {
			options: {
				colorize: true,
				ignore:
					"pid,hostname,reqId,method,url,statusCode,responseTime",
				translateTime: "HH:MM:ss",
			},
			target: "pino-pretty",
		},
	};
}
