import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import sensible from "@fastify/sensible";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import type { FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

const foundationPlugin: FastifyPluginAsync = async (fastify) => {
	fastify.setValidatorCompiler(validatorCompiler);
	fastify.setSerializerCompiler(serializerCompiler);

	await fastify.register(cors, {
		credentials: true,
		origin: fastify.config.TRUSTED_ORIGINS,
	});
	await fastify.register(helmet, {
		contentSecurityPolicy: false,
	});
	await fastify.register(rateLimit, {
		max: 120,
		timeWindow: "1 minute",
	});
	await fastify.register(sensible);
	await fastify.register(swagger, {
		openapi: {
			info: {
				description:
					"TypeScript migration interface for the Laxiriir Expert platform.",
				title: "Laxiriir Expert API",
				version: "0.1.0",
			},
			servers: [
				{
					description: "Local migration server",
					url: fastify.config.BETTER_AUTH_URL,
				},
			],
		},
		transform: jsonSchemaTransform,
	});
	await fastify.register(swaggerUi, {
		routePrefix: "/documentation",
		staticCSP: true,
	});
};

export default fastifyPlugin(foundationPlugin, {
	dependencies: ["config"],
	fastify: "5.x",
	name: "foundation",
});
