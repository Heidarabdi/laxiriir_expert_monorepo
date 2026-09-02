import { relations } from "drizzle-orm";
import {
	boolean,
	index,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema.ts";
import { bookings } from "./consultation-schema.ts";

export const messages = pgTable(
	"messages",
	{
		id: text("id").primaryKey(),
		bookingId: text("booking_id")
			.notNull()
			.references(() => bookings.id, { onDelete: "cascade" }),
		senderUserId: text("sender_user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		body: text("body").notNull(),
		readAt: timestamp("read_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("messages_booking_created_idx").on(table.bookingId, table.createdAt),
		index("messages_sender_created_idx").on(
			table.senderUserId,
			table.createdAt,
		),
	],
);

export const userPreferences = pgTable("user_preferences", {
	userId: text("user_id")
		.primaryKey()
		.references(() => user.id, { onDelete: "cascade" }),
	timezone: text("timezone").default("UTC").notNull(),
	emailBookingUpdates: boolean("email_booking_updates").default(true).notNull(),
	inAppBookingUpdates: boolean("in_app_booking_updates")
		.default(true)
		.notNull(),
	createdAt: timestamp("created_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.defaultNow()
		.notNull(),
});

export const supportCases = pgTable(
	"support_cases",
	{
		id: text("id").primaryKey(),
		requesterUserId: text("requester_user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		bookingId: text("booking_id").references(() => bookings.id, {
			onDelete: "set null",
		}),
		subject: text("subject").notNull(),
		description: text("description").notNull(),
		priority: text("priority").default("normal").notNull(),
		status: text("status").default("open").notNull(),
		assignedAdminUserId: text("assigned_admin_user_id").references(
			() => user.id,
			{ onDelete: "set null" },
		),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("support_cases_requester_created_idx").on(
			table.requesterUserId,
			table.createdAt,
		),
		index("support_cases_status_created_idx").on(
			table.status,
			table.createdAt,
		),
	],
);

export const messageRelations = relations(messages, ({ one }) => ({
	booking: one(bookings, {
		fields: [messages.bookingId],
		references: [bookings.id],
	}),
	sender: one(user, {
		fields: [messages.senderUserId],
		references: [user.id],
	}),
}));

export const preferenceRelations = relations(userPreferences, ({ one }) => ({
	user: one(user, {
		fields: [userPreferences.userId],
		references: [user.id],
	}),
}));

export const supportCaseRelations = relations(supportCases, ({ one }) => ({
	requester: one(user, {
		fields: [supportCases.requesterUserId],
		references: [user.id],
	}),
	booking: one(bookings, {
		fields: [supportCases.bookingId],
		references: [bookings.id],
	}),
}));
