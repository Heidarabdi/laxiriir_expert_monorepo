import type { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";

import type { AppOptions } from "../app-options.js";
import type { AppDatabase } from "../db/postgres.js";

declare module "fastify" {
	interface FastifyInstance {
		database?: AppDatabase;
	}
}

const databasePlugin: FastifyPluginAsync<AppOptions> = async (
	fastify,
	options,
) => {
	fastify.decorate("database", options.database);
};

export default fastifyPlugin(databasePlugin, {
	fastify: "5.x",
	name: "database",
});
