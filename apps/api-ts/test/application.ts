import path from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";

import { createAuth } from "../src/auth/factory.js";
import type { AppDatabase } from "../src/db/postgres.js";
import * as schema from "../src/db/schema.js";
import { buildServer } from "../src/server.js";
import {
	createTestConfig,
	type TestConfigOverrides,
} from "./helpers.js";

export async function createTestApplication(
	configOverrides: TestConfigOverrides = {},
) {
	const client = new PGlite();
	const database = drizzle({ client, schema });
	await migrate(database, {
		migrationsFolder: path.join(
			fileURLToPath(new URL("..", import.meta.url)),
			"drizzle",
		),
	});

	const config = createTestConfig(configOverrides);
	const auth = createAuth(database, config);
	const server = buildServer({
		auth,
		config,
		database: database as unknown as AppDatabase,
	});

	return {
		auth,
		client,
		database,
		server,
		async close() {
			await server.close();
			await client.close();
		},
	};
}
