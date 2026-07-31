import closeWithGrace from "close-with-grace";

import { createAuth } from "./auth/factory.js";
import { readApiConfig } from "./config.js";
import { createPostgresDatabase } from "./db/postgres.js";
import { buildServer } from "./server.js";

const config = readApiConfig();
const database = createPostgresDatabase(config.DATABASE_URL);
const auth = createAuth(database.db, config);
const server = buildServer({
	auth,
	config,
	logger:
		config.LOG_LEVEL === "silent"
			? false
			: {
					level: config.LOG_LEVEL,
					redact: {
						censor: "[Redacted]",
						paths: [
							"req.body.password",
							"req.body.token",
							"req.headers.authorization",
							"req.headers.cookie",
							"res.headers.set-cookie",
						],
					},
				},
});

server.addHook("onClose", async () => {
	await database.close();
});

closeWithGrace({ delay: 10_000 }, async ({ err, signal }) => {
	if (err) {
		server.log.error({ err }, "server closing after an error");
	} else {
		server.log.info({ signal }, "server shutting down");
	}

	await server.close();
});

await server.listen({
	host: config.HOST,
	port: config.PORT,
});
