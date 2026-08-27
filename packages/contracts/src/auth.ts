import { z } from "zod";

export const primaryRoleSchema = z.enum(["client", "expert", "admin"]);
export const primaryRoles = primaryRoleSchema.options;
export type PrimaryRole = z.infer<typeof primaryRoleSchema>;

export const publicRegistrationRoleSchema = z.enum(["client", "expert"]);
export const publicRegistrationRoles = publicRegistrationRoleSchema.options;
export type PublicRegistrationRole = z.infer<
	typeof publicRegistrationRoleSchema
>;

export const expertStatusSchema = z.enum([
	"not_applicable",
	"pending_review",
	"approved",
	"rejected",
	"suspended",
]);
export const expertStatuses = expertStatusSchema.options;
export type ExpertStatus = z.infer<typeof expertStatusSchema>;

export const allowedAreaSchema = z.enum([
	"client",
	"expert",
	"expert_pending",
	"admin",
]);
export const allowedAreas = allowedAreaSchema.options;
export type AllowedArea = z.infer<typeof allowedAreaSchema>;

export const expertStatusActionSchema = z.enum([
	"approve",
	"reject",
	"suspend",
]);
export const expertStatusActions = expertStatusActionSchema.options;
export type ExpertStatusAction = z.infer<typeof expertStatusActionSchema>;

export const accountProfileSummarySchema = z.object({
	createdAt: z.string().datetime(),
	displayName: z.string(),
	email: z.string().email(),
	expertStatus: z.enum(["approved", "rejected", "suspended"]),
	identityUserId: z.string(),
	primaryRole: z.literal("expert"),
	updatedAt: z.string().datetime(),
});
export type AccountProfileSummary = z.infer<typeof accountProfileSummarySchema>;

export const currentUserSchema = z.object({
	allowedAreas: z.array(allowedAreaSchema),
	displayName: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	expertStatus: expertStatusSchema,
	primaryRole: primaryRoleSchema,
	userId: z.string(),
});
export type CurrentUserResponse = z.infer<typeof currentUserSchema>;

export const expertStatusUpdateResponseSchema = z.object({
	message: z.string(),
	profile: accountProfileSummarySchema,
});
export type ExpertStatusUpdateResponse = z.infer<
	typeof expertStatusUpdateResponseSchema
>;

export const expertStatusActionParamsSchema = z.object({
	action: expertStatusActionSchema,
	id: z.string().trim().min(1),
});

export const signInInputSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});
export type SignInInput = z.infer<typeof signInInputSchema>;

export const signUpInputSchema = z.object({
	email: z.string().email(),
	name: z.string().trim().min(1),
	password: z.string().min(1),
	role: publicRegistrationRoleSchema,
});
export type SignUpInput = z.infer<typeof signUpInputSchema>;
