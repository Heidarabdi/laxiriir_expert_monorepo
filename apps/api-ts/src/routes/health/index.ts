import type { FastifyPluginAsync } from "fastify";

const healthRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get(
		"",
		{
			logLevel: "silent",
		},
		async () => ({
			env: fastify.config.NODE_ENV,
			status: "ok",
		}),
	);
};

export default healthRoutes;
