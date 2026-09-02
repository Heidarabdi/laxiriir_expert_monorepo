import { expertSchema } from "@repo/contracts/consultations";
import { z } from "zod";

export const savedExpertSchema = z.object({
	expert: expertSchema,
	savedAt: z.string().datetime(),
});
export type SavedExpert = z.infer<typeof savedExpertSchema>;

export const savedExpertResponseSchema = z.object({
	savedExpert: savedExpertSchema,
});
export type SavedExpertResponse = z.infer<typeof savedExpertResponseSchema>;

export const savedExpertListResponseSchema = z.object({
	savedExperts: z.array(savedExpertSchema),
});
export type SavedExpertListResponse = z.infer<
	typeof savedExpertListResponseSchema
>;

export const savedExpertParamsSchema = z.object({
	expertId: z.string().trim().min(1),
});

export const notificationTypeSchema = z.enum([
	"booking_confirmed",
	"booking_cancelled",
	"booking_rescheduled",
	"account",
]);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationSchema = z.object({
	createdAt: z.string().datetime(),
	href: z.string().nullable(),
	id: z.string(),
	message: z.string(),
	readAt: z.string().datetime().nullable(),
	title: z.string(),
	type: notificationTypeSchema,
});
export type Notification = z.infer<typeof notificationSchema>;

export const notificationResponseSchema = z.object({
	notification: notificationSchema,
});
export type NotificationResponse = z.infer<typeof notificationResponseSchema>;

export const notificationListResponseSchema = z.object({
	notifications: z.array(notificationSchema),
	unreadCount: z.number().int().nonnegative(),
});
export type NotificationListResponse = z.infer<
	typeof notificationListResponseSchema
>;

export const notificationParamsSchema = z.object({
	id: z.string().trim().min(1),
});

export const markAllNotificationsReadResponseSchema = z.object({
	updatedCount: z.number().int().nonnegative(),
});
export type MarkAllNotificationsReadResponse = z.infer<
	typeof markAllNotificationsReadResponseSchema
>;

export const engagementErrorResponseSchema = z.object({ message: z.string() });
