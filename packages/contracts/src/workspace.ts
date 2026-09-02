import { bookingStatusSchema } from "@repo/contracts/consultations";
import { z } from "zod";

export const messageSchema = z.object({
	body: z.string(),
	bookingId: z.string(),
	createdAt: z.string().datetime(),
	id: z.string(),
	readAt: z.string().datetime().nullable(),
	senderUserId: z.string(),
});
export type Message = z.infer<typeof messageSchema>;

export const conversationSchema = z.object({
	bookingId: z.string(),
	bookingStartsAt: z.string().datetime(),
	bookingStatus: bookingStatusSchema,
	counterpart: z.object({
		avatarUrl: z.string().url().nullable(),
		displayName: z.string(),
		id: z.string(),
	}),
	lastMessage: messageSchema.nullable(),
	unreadCount: z.number().int().nonnegative(),
});
export type Conversation = z.infer<typeof conversationSchema>;

export const conversationListResponseSchema = z.object({
	conversations: z.array(conversationSchema),
});
export type ConversationListResponse = z.infer<
	typeof conversationListResponseSchema
>;

export const conversationResponseSchema = z.object({
	conversation: conversationSchema,
	messages: z.array(messageSchema),
});
export type ConversationResponse = z.infer<typeof conversationResponseSchema>;

export const sendMessageInputSchema = z.object({
	body: z.string().trim().min(1).max(4000),
});
export type SendMessageInput = z.infer<typeof sendMessageInputSchema>;

export const messageResponseSchema = z.object({ message: messageSchema });
export type MessageResponse = z.infer<typeof messageResponseSchema>;

export const bookingConversationParamsSchema = z.object({
	bookingId: z.string().trim().min(1),
});

export const markConversationReadResponseSchema = z.object({
	updatedCount: z.number().int().nonnegative(),
});
export type MarkConversationReadResponse = z.infer<
	typeof markConversationReadResponseSchema
>;

export const workspacePreferencesSchema = z.object({
	emailBookingUpdates: z.boolean(),
	inAppBookingUpdates: z.boolean(),
	timezone: z.string().trim().min(1).max(100),
});
export type WorkspacePreferences = z.infer<typeof workspacePreferencesSchema>;
export const workspacePreferencesResponseSchema = z.object({
	preferences: workspacePreferencesSchema,
});
export type WorkspacePreferencesResponse = z.infer<
	typeof workspacePreferencesResponseSchema
>;

export const supportCaseStatusSchema = z.enum([
	"open",
	"in_progress",
	"resolved",
]);
export type SupportCaseStatus = z.infer<typeof supportCaseStatusSchema>;
export const supportCasePrioritySchema = z.enum(["normal", "urgent"]);
export type SupportCasePriority = z.infer<typeof supportCasePrioritySchema>;

export const supportCaseSchema = z.object({
	assignedAdminUserId: z.string().nullable(),
	bookingId: z.string().nullable(),
	createdAt: z.string().datetime(),
	description: z.string(),
	id: z.string(),
	priority: supportCasePrioritySchema,
	requester: z.object({
		displayName: z.string(),
		email: z.string().email(),
		id: z.string(),
	}),
	status: supportCaseStatusSchema,
	subject: z.string(),
	updatedAt: z.string().datetime(),
});
export type SupportCase = z.infer<typeof supportCaseSchema>;

export const supportCaseListResponseSchema = z.object({
	cases: z.array(supportCaseSchema),
});
export type SupportCaseListResponse = z.infer<
	typeof supportCaseListResponseSchema
>;
export const supportCaseResponseSchema = z.object({ case: supportCaseSchema });
export type SupportCaseResponse = z.infer<typeof supportCaseResponseSchema>;

export const createSupportCaseInputSchema = z.object({
	bookingId: z.string().trim().min(1).nullable().optional(),
	description: z.string().trim().min(20).max(4000),
	priority: supportCasePrioritySchema.default("normal"),
	subject: z.string().trim().min(4).max(160),
});
export type CreateSupportCaseInput = z.infer<
	typeof createSupportCaseInputSchema
>;

export const updateSupportCaseInputSchema = z.object({
	assignToMe: z.boolean().optional(),
	status: supportCaseStatusSchema,
});
export type UpdateSupportCaseInput = z.infer<
	typeof updateSupportCaseInputSchema
>;

export const supportCaseParamsSchema = z.object({
	id: z.string().trim().min(1),
});

export const workspaceErrorResponseSchema = z.object({ message: z.string() });
