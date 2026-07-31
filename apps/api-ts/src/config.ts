import { z } from "zod";

const developmentAuthSecret = "development-only-secret-change-me";

export const apiConfigSchema = z
	.object({
		BETTER_AUTH_SECRET: z.string().min(32).default(developmentAuthSecret),
		BETTER_AUTH_URL: z.string().url().default("http://localhost:8081"),
		DATABASE_URL: z
			.string()
			.url()
			.default("postgres://postgres:postgres@localhost:5432/laxiriir_expert"),
		HOST: z.string().default("0.0.0.0"),
		LOG_LEVEL: z
			.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
			.default("info"),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		PORT: z.coerce.number().int().min(1).max(65_535).default(8081),
		TRUSTED_ORIGINS: z
			.string()
			.default("http://localhost:3000")
			.transform((value) =>
				value
					.split(",")
					.map((origin) => origin.trim())
					.filter(Boolean),
			)
			.pipe(z.array(z.string().url()).min(1)),
		TRUST_PROXY: z
			.enum(["true", "false"])
			.default("false")
			.transform((value) => value === "true"),
	})
	.superRefine((config, context) => {
		if (
			config.NODE_ENV === "production" &&
			config.BETTER_AUTH_SECRET === developmentAuthSecret
		) {
			context.addIssue({
				code: "custom",
				message: "BETTER_AUTH_SECRET must be changed in production",
				path: ["BETTER_AUTH_SECRET"],
			});
		}
	});

export type ApiConfig = z.infer<typeof apiConfigSchema>;

export function readApiConfig(
	environment: NodeJS.ProcessEnv = process.env,
): ApiConfig {
	return apiConfigSchema.parse(environment);
}
