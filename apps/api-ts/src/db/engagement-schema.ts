import { relations } from "drizzle-orm";
import {
	index,
	pgTable,
	primaryKey,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

import { user } from "./auth-schema.ts";
import { experts } from "./consultation-schema.ts";

export const savedExperts = pgTable(
	"saved_experts",
	{
		clientUserId: text("client_user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		expertId: text("expert_id")
			.notNull()
			.references(() => experts.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		primaryKey({ columns: [table.clientUserId, table.expertId] }),
		index("saved_experts_client_created_idx").on(
			table.clientUserId,
			table.createdAt,
		),
	],
);

export const notifications = pgTable(
	"notifications",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		type: text("type").notNull(),
		title: text("title").notNull(),
		message: text("message").notNull(),
		href: text("href"),
		readAt: timestamp("read_at", { withTimezone: true }),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		index("notifications_user_created_idx").on(table.userId, table.createdAt),
	],
);

export const savedExpertRelations = relations(savedExperts, ({ one }) => ({
	client: one(user, {
		fields: [savedExperts.clientUserId],
		references: [user.id],
	}),
	expert: one(experts, {
		fields: [savedExperts.expertId],
		references: [experts.id],
	}),
}));

export const notificationRelations = relations(notifications, ({ one }) => ({
	user: one(user, {
		fields: [notifications.userId],
		references: [user.id],
	}),
}));
