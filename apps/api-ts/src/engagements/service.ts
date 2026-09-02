import { randomUUID } from "node:crypto";
import type { ExpertStatus } from "@repo/contracts/auth";
import type { NotificationType } from "@repo/contracts/engagements";
import { and, asc, desc, eq, isNull, or } from "drizzle-orm";

import { user } from "../db/auth-schema.ts";
import { experts } from "../db/consultation-schema.ts";
import { notifications, savedExperts } from "../db/engagement-schema.ts";
import type { AppDatabase } from "../db/postgres.js";

const productionVisibleExpertStatuses = [
	"approved",
] as const satisfies readonly ExpertStatus[];
const developmentVisibleExpertStatuses = [
	...productionVisibleExpertStatuses,
	"pending_review",
] as const satisfies readonly ExpertStatus[];

export class ExpertUnavailableError extends Error {
	constructor() {
		super("expert is not available");
		this.name = "ExpertUnavailableError";
	}
}

export class NotificationNotFoundError extends Error {
	constructor() {
		super("notification not found");
		this.name = "NotificationNotFoundError";
	}
}

function serializeExpert(expert: typeof experts.$inferSelect) {
	return {
		...expert,
		createdAt: expert.createdAt.toISOString(),
		updatedAt: expert.updatedAt.toISOString(),
	};
}

function serializeNotification(
	notification: typeof notifications.$inferSelect,
) {
	return {
		createdAt: notification.createdAt.toISOString(),
		href: notification.href,
		id: notification.id,
		message: notification.message,
		readAt: notification.readAt?.toISOString() ?? null,
		title: notification.title,
		type: notification.type as NotificationType,
	};
}

export class EngagementService {
	private readonly database: AppDatabase;
	private readonly allowPendingExperts: boolean;

	constructor(
		database: AppDatabase,
		options: { allowPendingExperts?: boolean } = {},
	) {
		this.database = database;
		this.allowPendingExperts = options.allowPendingExperts ?? false;
	}

	private visibleExpertIdentity() {
		const statuses = this.allowPendingExperts
			? developmentVisibleExpertStatuses
			: productionVisibleExpertStatuses;
		return or(
			isNull(user.id),
			...statuses.map((status) => eq(user.expertStatus, status)),
		);
	}

	async listSavedExperts(clientUserId: string) {
		const rows = await this.database
			.select({ expert: experts, savedAt: savedExperts.createdAt })
			.from(savedExperts)
			.innerJoin(experts, eq(savedExperts.expertId, experts.id))
			.leftJoin(user, eq(experts.id, user.id))
			.where(
				and(
					eq(savedExperts.clientUserId, clientUserId),
					eq(experts.active, true),
					this.visibleExpertIdentity(),
				),
			)
			.orderBy(desc(savedExperts.createdAt), asc(experts.displayName));

		return rows.map(({ expert, savedAt }) => ({
			expert: serializeExpert(expert),
			savedAt: savedAt.toISOString(),
		}));
	}

	async saveExpert(clientUserId: string, expertId: string, now = new Date()) {
		return this.database.transaction(async (transaction) => {
			const [expert] = await transaction
				.select({ expert: experts })
				.from(experts)
				.leftJoin(user, eq(experts.id, user.id))
				.where(
					and(
						eq(experts.id, expertId),
						eq(experts.active, true),
						this.visibleExpertIdentity(),
					),
				)
				.limit(1);
			if (!expert) throw new ExpertUnavailableError();

			await transaction
				.insert(savedExperts)
				.values({ clientUserId, createdAt: now, expertId })
				.onConflictDoNothing();
			const [saved] = await transaction
				.select({ savedAt: savedExperts.createdAt })
				.from(savedExperts)
				.where(
					and(
						eq(savedExperts.clientUserId, clientUserId),
						eq(savedExperts.expertId, expertId),
					),
				)
				.limit(1);

			return {
				expert: serializeExpert(expert.expert),
				savedAt: saved.savedAt.toISOString(),
			};
		});
	}

	async removeSavedExpert(clientUserId: string, expertId: string) {
		await this.database
			.delete(savedExperts)
			.where(
				and(
					eq(savedExperts.clientUserId, clientUserId),
					eq(savedExperts.expertId, expertId),
				),
			);
	}

	async listNotifications(userId: string) {
		const rows = await this.database
			.select()
			.from(notifications)
			.where(eq(notifications.userId, userId))
			.orderBy(desc(notifications.createdAt));
		return {
			notifications: rows.map(serializeNotification),
			unreadCount: rows.filter((notification) => !notification.readAt).length,
		};
	}

	async markNotificationRead(userId: string, notificationId: string) {
		const [notification] = await this.database
			.update(notifications)
			.set({ readAt: new Date() })
			.where(
				and(
					eq(notifications.id, notificationId),
					eq(notifications.userId, userId),
				),
			)
			.returning();
		if (!notification) throw new NotificationNotFoundError();
		return serializeNotification(notification);
	}

	async markAllNotificationsRead(userId: string) {
		const updated = await this.database
			.update(notifications)
			.set({ readAt: new Date() })
			.where(
				and(eq(notifications.userId, userId), isNull(notifications.readAt)),
			)
			.returning({ id: notifications.id });
		return updated.length;
	}

	async createNotification(input: {
		href?: string;
		message: string;
		title: string;
		type: NotificationType;
		userId: string;
	}) {
		const [notification] = await this.database
			.insert(notifications)
			.values({ id: randomUUID(), ...input })
			.returning();
		return serializeNotification(notification);
	}
}
