import type { FastifyError, FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

function publicErrorName(error: FastifyError, statusCode: number) {
	if (statusCode === 400) {
		return "Bad Request";
	}
	if (statusCode === 401) {
		return "Unauthorized";
	}
	if (statusCode === 403) {
		return "Forbidden";
	}
	if (statusCode === 404) {
		return "Not Found";
	}
	if (statusCode === 409) {
		return "Conflict";
	}
	if (statusCode >= 500) {
		return "Internal Server Error";
	}

	return error.name || "Error";
}

const errorsPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.setNotFoundHandler(async (request, reply) => {
		reply.status(404);
		return {
			error: "Not Found",
			message: `Route ${request.method} ${request.url} not found`,
			statusCode: 404,
		};
	});

	fastify.setErrorHandler<FastifyError>(async (error, request, reply) => {
		const statusCode = error.validation
			? 400
			: Math.min(Math.max(error.statusCode ?? 500, 400), 599);

		if (statusCode >= 500) {
			request.log.error({ err: error }, "request failed");
		} else {
			request.log.warn({ err: error }, "request rejected");
		}

		reply.status(statusCode);
		return {
			error: publicErrorName(error, statusCode),
			message:
				statusCode >= 500 ? "An unexpected error occurred" : error.message,
			statusCode,
		};
	});
};

export default fastifyPlugin(errorsPlugin, {
	fastify: "5.x",
	name: "errors",
});
