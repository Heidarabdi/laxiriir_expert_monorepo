import type { FastifyPluginAsync } from "fastify";

const pingRoutes: FastifyPluginAsync = async (fastify) => {
	fastify.get("", async () => ({
		message: "pong",
	}));
};

export default pingRoutes;
