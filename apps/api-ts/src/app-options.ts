import type { FastifyServerOptions } from "fastify";

import type { AppAuth } from "./auth/factory.js";
import type { ApiConfig } from "./config.js";
import type { AppDatabase } from "./db/postgres.js";

export interface AppOptions {
	auth?: AppAuth;
	config: ApiConfig;
	database?: AppDatabase;
	logger?: FastifyServerOptions["logger"];
}
