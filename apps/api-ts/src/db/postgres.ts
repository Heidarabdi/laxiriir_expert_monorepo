import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema.js";

export function createPostgresDatabase(databaseUrl: string) {
	const pool = new Pool({ connectionString: databaseUrl });
	const db = drizzle({ client: pool, schema });

	return {
		close: () => pool.end(),
		db,
	};
}

export type AppDatabase = ReturnType<typeof createPostgresDatabase>["db"];
