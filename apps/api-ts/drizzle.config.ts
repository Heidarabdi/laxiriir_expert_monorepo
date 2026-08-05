import { config as loadEnvironment } from "dotenv";
import { defineConfig } from "drizzle-kit";

loadEnvironment({ path: new URL("./.env.local", import.meta.url) });
loadEnvironment({ path: new URL("./.env", import.meta.url) });

export default defineConfig({
	dbCredentials: {
		url:
			process.env.DATABASE_URL ??
			"postgresql://postgres:postgres@localhost:5432/laxiriir_expert",
	},
	dialect: "postgresql",
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	strict: true,
	verbose: true,
});
