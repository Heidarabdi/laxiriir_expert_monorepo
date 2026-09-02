import closeWithGrace from "close-with-grace";

import { createAuth } from "./auth/factory.js";
import { getDevelopmentSeedPassword, readApiConfig } from "./config.js";
import { ConsultationService } from "./consultations/service.js";
import { seedDevelopmentWorkspace } from "./db/development-seed.js";
import { createPostgresDatabase } from "./db/postgres.js";
import { createLoggerOptions } from "./logger.js";
import { buildServer } from "./server.js";

const config = readApiConfig();
const database = createPostgresDatabase(config.DATABASE_URL);
const auth = createAuth(database.db, config);
if (config.NODE_ENV === "development") {
	await new ConsultationService(database.db).seedDemoData();
	const password = getDevelopmentSeedPassword(config);
	if (password) {
		await seedDevelopmentWorkspace(database.db, auth, { password });
	}
}
const server = buildServer({
	auth,
	config,
	database: database.db,
	logger: createLoggerOptions(config),
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
