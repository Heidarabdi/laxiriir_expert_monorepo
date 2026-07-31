import { z } from "zod";

const developmentAuthSecret = "development-only-secret-change-me";
const developmentDatabaseUrl =
	"postgres://postgres:postgres@localhost:5432/laxiriir_expert";

export const apiConfigSchema = z
	.object({
		AUTH_BOOTSTRAP_ADMIN_EMAILS: z
			.string()
			.default("")
			.transform((value) =>
				value
					.split(",")
					.map((email) => email.trim().toLowerCase())
					.filter(Boolean),
			),
		BETTER_AUTH_SECRET: z.string().min(32).default(developmentAuthSecret),
		BETTER_AUTH_URL: z.string().url().default("http://localhost:8081"),
		DATABASE_URL: z.string().url().default(developmentDatabaseUrl),
		EMAIL_FROM: z.string().default(""),
		HOST: z.string().default("0.0.0.0"),
		LOG_LEVEL: z
			.enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
			.default("info"),
		NODE_ENV: z
			.enum(["development", "production", "test"])
			.default("development"),
		PORT: z.coerce.number().int().min(1).max(65_535).default(8081),
		RESEND_API_KEY: z.string().default(""),
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

		if (
			config.NODE_ENV === "production" &&
			config.DATABASE_URL === developmentDatabaseUrl
		) {
			context.addIssue({
				code: "custom",
				message: "DATABASE_URL must be configured in production",
				path: ["DATABASE_URL"],
			});
		}

		if (
			config.NODE_ENV === "production" &&
			(!config.EMAIL_FROM || !config.RESEND_API_KEY)
		) {
			context.addIssue({
				code: "custom",
				message: "EMAIL_FROM and RESEND_API_KEY are required in production",
				path: ["RESEND_API_KEY"],
			});
		}

		if (
			config.NODE_ENV === "production" &&
			new URL(config.BETTER_AUTH_URL).protocol !== "https:"
		) {
			context.addIssue({
				code: "custom",
				message: "BETTER_AUTH_URL must use HTTPS in production",
				path: ["BETTER_AUTH_URL"],
			});
		}

		if (
			config.NODE_ENV === "production" &&
			config.TRUSTED_ORIGINS.some(
				(origin) => new URL(origin).protocol !== "https:",
			)
		) {
			context.addIssue({
				code: "custom",
				message: "TRUSTED_ORIGINS must use HTTPS in production",
				path: ["TRUSTED_ORIGINS"],
			});
		}
	});

export type ApiConfig = z.infer<typeof apiConfigSchema>;

export function readApiConfig(
	environment: NodeJS.ProcessEnv = process.env,
): ApiConfig {
	return apiConfigSchema.parse(environment);
}
