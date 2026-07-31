import { type ApiConfig, apiConfigSchema } from "../src/config.js";

export function createTestConfig(
	overrides: Partial<ApiConfig> = {},
): ApiConfig {
	return apiConfigSchema.parse({
		HOST: "127.0.0.1",
		LOG_LEVEL: "silent",
		NODE_ENV: "test",
		PORT: 8081,
		...overrides,
	});
}
