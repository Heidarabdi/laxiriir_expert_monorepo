import { type ApiConfig, apiConfigSchema } from "../src/config.js";
import type { z } from "zod";

export type TestConfigOverrides = Partial<z.input<typeof apiConfigSchema>>;

export function createTestConfig(
	overrides: TestConfigOverrides = {},
): ApiConfig {
	return apiConfigSchema.parse({
		HOST: "127.0.0.1",
		LOG_LEVEL: "silent",
		NODE_ENV: "test",
		PORT: 8081,
		...overrides,
	});
}
