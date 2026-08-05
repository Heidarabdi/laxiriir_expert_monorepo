import { relations, sql } from "drizzle-orm";
import {
	bigint,
	bigserial,
	boolean,
	check,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";

export const experts = pgTable(
	"experts",
	{
		active: boolean("active").default(true).notNull(),
		id: text("id").primaryKey(),
		displayName: text("display_name").notNull(),
		title: text("title").notNull(),
		category: text("category").notNull(),
		bio: text("bio").notNull(),
		hourlyRateCents: integer("hourly_rate_cents").notNull(),
		avatarUrl: text("avatar_url").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		check(
			"experts_hourly_rate_cents_check",
			sql`${table.hourlyRateCents} >= 0`,
		),
	],
);

export const availabilitySlots = pgTable(
	"availability_slots",
	{
		id: bigserial("id", { mode: "number" }).primaryKey(),
		expertId: text("expert_id")
			.notNull()
			.references(() => experts.id, { onDelete: "cascade" }),
		startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
		endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
		booked: boolean("booked").default(false).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		check(
			"availability_slot_time_order",
			sql`${table.endsAt} > ${table.startsAt}`,
		),
		index("availability_slots_expert_start_idx").on(
			table.expertId,
			table.startsAt,
		),
		uniqueIndex("availability_slot_unique_time").on(
			table.expertId,
			table.startsAt,
		),
	],
);

export const bookings = pgTable(
	"bookings",
	{
		id: text("id").primaryKey(),
		clientUserId: text("client_user_id").notNull(),
		expertId: text("expert_id")
			.notNull()
			.references(() => experts.id),
		availabilitySlotId: bigint("availability_slot_id", { mode: "number" })
			.notNull()
			.references(() => availabilitySlots.id),
		startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
		endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
		status: text("status").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
	},
	(table) => [
		check("booking_time_order", sql`${table.endsAt} > ${table.startsAt}`),
		index("bookings_client_start_idx").on(
			table.clientUserId,
			table.startsAt,
		),
		uniqueIndex("bookings_confirmed_availability_slot_unique")
			.on(table.availabilitySlotId)
			.where(sql`${table.status} = 'confirmed'`),
	],
);

export const expertRelations = relations(experts, ({ many }) => ({
	availabilitySlots: many(availabilitySlots),
	bookings: many(bookings),
}));

export const availabilityRelations = relations(
	availabilitySlots,
	({ one }) => ({
		expert: one(experts, {
			fields: [availabilitySlots.expertId],
			references: [experts.id],
		}),
	}),
);

export const bookingRelations = relations(bookings, ({ one }) => ({
	expert: one(experts, {
		fields: [bookings.expertId],
		references: [experts.id],
	}),
	availabilitySlot: one(availabilitySlots, {
		fields: [bookings.availabilitySlotId],
		references: [availabilitySlots.id],
	}),
}));
