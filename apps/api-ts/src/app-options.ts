import type { FastifyServerOptions } from "fastify";

import type { AppAuth } from "./auth/factory.js";
import type { ApiConfig } from "./config.js";

export interface AppOptions {
	auth?: AppAuth;
	config: ApiConfig;
	logger?: FastifyServerOptions["logger"];
}
