import { defineConfig } from "drizzle-kit";

export default defineConfig({
	dbCredentials: {
		url:
			process.env.DATABASE_URL ??
			"postgresql://postgres:postgres@localhost:5432/laxiriir",
	},
	dialect: "postgresql",
	out: "./drizzle",
	schema: "./src/db/schema.ts",
	strict: true,
	verbose: true,
});
