import { randomUUID } from "node:crypto";
import type { PrimaryRole } from "@repo/contracts/auth";
import type {
	SupportCasePriority,
	SupportCaseStatus,
} from "@repo/contracts/workspace";
import {
	and,
	asc,
	desc,
	eq,
	inArray,
	isNull,
	ne,
} from "drizzle-orm";

import { user } from "../db/auth-schema.ts";
import { bookings, experts } from "../db/consultation-schema.ts";
import { notifications } from "../db/engagement-schema.ts";
import type { AppDatabase } from "../db/postgres.js";
import {
	messages,
	supportCases,
	userPreferences,
} from "../db/workspace-schema.ts";

export class ConversationNotFoundError extends Error {
	constructor() {
		super("conversation not found");
		this.name = "ConversationNotFoundError";
	}
}

export class SupportCaseNotFoundError extends Error {
	constructor() {
		super("support case not found");
		this.name = "SupportCaseNotFoundError";
	}
}

function serializeMessage(message: typeof messages.$inferSelect) {
	return {
		...message,
		createdAt: message.createdAt.toISOString(),
		readAt: message.readAt?.toISOString() ?? null,
	};
}

function serializeSupportCase(row: {
	case: typeof supportCases.$inferSelect;
	requester: { email: string; id: string; name: string };
}) {
	return {
		assignedAdminUserId: row.case.assignedAdminUserId,
		bookingId: row.case.bookingId,
		createdAt: row.case.createdAt.toISOString(),
		description: row.case.description,
		id: row.case.id,
		priority: row.case.priority as SupportCasePriority,
		requester: {
			displayName: row.requester.name,
			email: row.requester.email,
			id: row.requester.id,
		},
		status: row.case.status as SupportCaseStatus,
		subject: row.case.subject,
		updatedAt: row.case.updatedAt.toISOString(),
	};
}

export class WorkspaceService {
	private readonly database: AppDatabase;

	constructor(database: AppDatabase) {
		this.database = database;
	}

	private async conversationBookings(userId: string, role: PrimaryRole) {
		return this.database
			.select({
				booking: bookings,
				client: { id: user.id, name: user.name },
				expert: {
					avatarUrl: experts.avatarUrl,
					displayName: experts.displayName,
					id: experts.id,
				},
			})
			.from(bookings)
			.innerJoin(experts, eq(bookings.expertId, experts.id))
			.innerJoin(user, eq(bookings.clientUserId, user.id))
			.where(
				role === "client"
					? eq(bookings.clientUserId, userId)
					: eq(bookings.expertId, userId),
			)
			.orderBy(desc(bookings.startsAt));
	}

	private async requireConversation(
		userId: string,
		role: PrimaryRole,
		bookingId: string,
	) {
		const rows = await this.conversationBookings(userId, role);
		const row = rows.find(({ booking }) => booking.id === bookingId);
		if (!row) throw new ConversationNotFoundError();
		return row;
	}

	private conversationSummary(
		row: Awaited<ReturnType<WorkspaceService["conversationBookings"]>>[number],
		role: PrimaryRole,
		thread: (typeof messages.$inferSelect)[],
		userId: string,
	) {
		const lastMessage = thread.at(-1);
		return {
			bookingId: row.booking.id,
			bookingStartsAt: row.booking.startsAt.toISOString(),
			bookingStatus: row.booking.status as "cancelled" | "confirmed",
			counterpart:
				role === "client"
					? {
							avatarUrl: row.expert.avatarUrl,
							displayName: row.expert.displayName,
							id: row.expert.id,
						}
					: {
							avatarUrl: null,
							displayName: row.client.name,
							id: row.client.id,
						},
			lastMessage: lastMessage ? serializeMessage(lastMessage) : null,
			unreadCount: thread.filter(
				(message) => message.senderUserId !== userId && !message.readAt,
			).length,
		};
	}

	async listConversations(userId: string, role: PrimaryRole) {
		const bookingRows = await this.conversationBookings(userId, role);
		if (bookingRows.length === 0) return [];
		const messageRows = await this.database
			.select()
			.from(messages)
			.where(
				inArray(
					messages.bookingId,
					bookingRows.map(({ booking }) => booking.id),
				),
			)
			.orderBy(asc(messages.createdAt));
		const byBooking = new Map<string, (typeof messages.$inferSelect)[]>();
		for (const message of messageRows) {
			const thread = byBooking.get(message.bookingId) ?? [];
			thread.push(message);
			byBooking.set(message.bookingId, thread);
		}
		return bookingRows.map((row) =>
			this.conversationSummary(
				row,
				role,
				byBooking.get(row.booking.id) ?? [],
				userId,
			),
		);
	}

	async getConversation(userId: string, role: PrimaryRole, bookingId: string) {
		const row = await this.requireConversation(userId, role, bookingId);
		const thread = await this.database
			.select()
			.from(messages)
			.where(eq(messages.bookingId, bookingId))
			.orderBy(asc(messages.createdAt));
		return {
			conversation: this.conversationSummary(row, role, thread, userId),
			messages: thread.map(serializeMessage),
		};
	}

	async sendMessage(
		userId: string,
		role: PrimaryRole,
		bookingId: string,
		body: string,
	) {
		const row = await this.requireConversation(userId, role, bookingId);
		const now = new Date();
		const [message] = await this.database.transaction(async (transaction) => {
			const inserted = await transaction
				.insert(messages)
				.values({ body, bookingId, createdAt: now, id: randomUUID(), senderUserId: userId })
				.returning();
			const recipientId =
				role === "client" ? row.expert.id : row.booking.clientUserId;
			await transaction.insert(notifications).values({
				createdAt: now,
				href: role === "client" ? "/expert/messages" : "/client/messages",
				id: randomUUID(),
				message: `${role === "client" ? row.client.name : row.expert.displayName} sent a message about your consultation.`,
				title: "New consultation message",
				type: "account",
				userId: recipientId,
			});
			return inserted;
		});
		return serializeMessage(message);
	}

	async markConversationRead(
		userId: string,
		role: PrimaryRole,
		bookingId: string,
	) {
		await this.requireConversation(userId, role, bookingId);
		const updated = await this.database
			.update(messages)
			.set({ readAt: new Date() })
			.where(
				and(
					eq(messages.bookingId, bookingId),
					ne(messages.senderUserId, userId),
					isNull(messages.readAt),
				),
			)
			.returning({ id: messages.id });
		return updated.length;
	}

	async getPreferences(userId: string) {
		const [preferences] = await this.database
			.insert(userPreferences)
			.values({ userId })
			.onConflictDoUpdate({
				set: { userId },
				target: userPreferences.userId,
			})
			.returning();
		return {
			emailBookingUpdates: preferences.emailBookingUpdates,
			inAppBookingUpdates: preferences.inAppBookingUpdates,
			timezone: preferences.timezone,
		};
	}

	async updatePreferences(
		userId: string,
		input: {
			emailBookingUpdates: boolean;
			inAppBookingUpdates: boolean;
			timezone: string;
		},
	) {
		const [preferences] = await this.database
			.insert(userPreferences)
			.values({ ...input, userId })
			.onConflictDoUpdate({
				set: { ...input, updatedAt: new Date() },
				target: userPreferences.userId,
			})
			.returning();
		return {
			emailBookingUpdates: preferences.emailBookingUpdates,
			inAppBookingUpdates: preferences.inAppBookingUpdates,
			timezone: preferences.timezone,
		};
	}

	async listSupportCases(userId?: string) {
		const query = this.database
			.select({ case: supportCases, requester: user })
			.from(supportCases)
			.innerJoin(user, eq(supportCases.requesterUserId, user.id));
		const rows = userId
			? await query
					.where(eq(supportCases.requesterUserId, userId))
					.orderBy(desc(supportCases.createdAt))
			: await query.orderBy(desc(supportCases.createdAt));
		return rows.map(serializeSupportCase);
	}

	async createSupportCase(
		userId: string,
		role: PrimaryRole,
		input: {
			bookingId?: string | null;
			description: string;
			priority: SupportCasePriority;
			subject: string;
		},
	) {
		if (input.bookingId) {
			await this.requireConversation(userId, role, input.bookingId);
		}
		const [created] = await this.database
			.insert(supportCases)
			.values({
				...input,
				bookingId: input.bookingId ?? null,
				id: randomUUID(),
				requesterUserId: userId,
			})
			.returning();
		const [requester] = await this.database
			.select()
			.from(user)
			.where(eq(user.id, userId))
			.limit(1);
		return serializeSupportCase({ case: created, requester });
	}

	async updateSupportCase(
		adminUserId: string,
		id: string,
		input: { assignToMe?: boolean; status: SupportCaseStatus },
	) {
		const [updated] = await this.database
			.update(supportCases)
			.set({
				assignedAdminUserId: input.assignToMe ? adminUserId : undefined,
				status: input.status,
				updatedAt: new Date(),
			})
			.where(eq(supportCases.id, id))
			.returning();
		if (!updated) throw new SupportCaseNotFoundError();
		const [requester] = await this.database
			.select()
			.from(user)
			.where(eq(user.id, updated.requesterUserId))
			.limit(1);
		return serializeSupportCase({ case: updated, requester });
	}
}
