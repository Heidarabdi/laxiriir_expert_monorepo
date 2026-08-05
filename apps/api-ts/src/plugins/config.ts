import type { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import type { ApiConfig } from "../config.js";

declare module "fastify" {
	interface FastifyInstance {
		config: ApiConfig;
	}
}

interface ConfigPluginOptions {
	config: ApiConfig;
}

const configPlugin: FastifyPluginAsync<ConfigPluginOptions> = async (
	fastify,
	options,
) => {
	fastify.decorate("config", options.config);
};

export default fastifyPlugin(configPlugin, {
	fastify: "5.x",
	name: "config",
});
