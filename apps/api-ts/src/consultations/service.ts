import { randomUUID } from "node:crypto";
import { and, asc, count, eq, gt } from "drizzle-orm";

import type { AppDatabase } from "../db/postgres.js";
import {
	availabilitySlots,
	bookings,
	experts,
} from "../db/consultation-schema.ts";

export class SlotUnavailableError extends Error {
	constructor() {
		super("availability slot is no longer available");
		this.name = "SlotUnavailableError";
	}
}

function serializeExpert(expert: typeof experts.$inferSelect) {
	return {
		...expert,
		createdAt: expert.createdAt.toISOString(),
		updatedAt: expert.updatedAt.toISOString(),
	};
}

function serializeSlot(slot: typeof availabilitySlots.$inferSelect) {
	return {
		...slot,
		createdAt: slot.createdAt.toISOString(),
		endsAt: slot.endsAt.toISOString(),
		startsAt: slot.startsAt.toISOString(),
	};
}

function serializeBooking(
	booking: typeof bookings.$inferSelect,
	expert: typeof experts.$inferSelect,
) {
	return {
		availabilitySlotId: booking.availabilitySlotId,
		clientUserId: booking.clientUserId,
		createdAt: booking.createdAt.toISOString(),
		endsAt: booking.endsAt.toISOString(),
		expert: serializeExpert(expert),
		id: booking.id,
		startsAt: booking.startsAt.toISOString(),
		status: "confirmed" as const,
	};
}

export class ConsultationService {
	private readonly database: AppDatabase;

	constructor(database: AppDatabase) {
		this.database = database;
	}

	async seedDemoData(now = new Date()) {
		const [{ total }] = await this.database
			.select({ total: count() })
			.from(experts);
		if (total > 0) {
			return;
		}

		const demoExperts = [
			{
				avatarUrl:
					"https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
				bio: "Former McKinsey partner helping teams turn difficult growth decisions into focused execution.",
				category: "Strategy",
				displayName: "Marcus Thorne",
				hourlyRateCents: 35_000,
				id: "marcus-thorne",
				title: "Strategy Consultant",
			},
			{
				avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
				bio: "CFA charterholder specializing in startup finance, fundraising, and practical financial planning.",
				category: "Finance",
				displayName: "Sarah Jenkins",
				hourlyRateCents: 27_500,
				id: "sarah-jenkins",
				title: "Financial Advisor",
			},
			{
				avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
				bio: "Operations leader helping growing companies improve delivery, systems, and team execution.",
				category: "Operations",
				displayName: "Elena Rodriguez",
				hourlyRateCents: 30_000,
				id: "elena-rodriguez",
				title: "Operations Expert",
			},
		] as const;

		await this.database.insert(experts).values(
			demoExperts.map((expert) => ({
				...expert,
				createdAt: now,
				updatedAt: now,
			})),
		);

		await this.database.insert(availabilitySlots).values(
			demoExperts.flatMap((expert, expertIndex) =>
				[1, 2, 3].map((dayOffset) => {
					const startsAt = new Date(now);
					startsAt.setUTCDate(startsAt.getUTCDate() + dayOffset);
					startsAt.setUTCHours(startsAt.getUTCHours() + expertIndex);
					return {
						createdAt: now,
						endsAt: new Date(startsAt.getTime() + 60 * 60 * 1000),
						expertId: expert.id,
						startsAt,
					};
				}),
			),
		);
	}

	async listExperts() {
		const rows = await this.database
			.select()
			.from(experts)
			.orderBy(asc(experts.displayName));
		return rows.map(serializeExpert);
	}

	async listAvailability(expertId: string, after = new Date()) {
		const rows = await this.database
			.select()
			.from(availabilitySlots)
			.where(
				and(
					eq(availabilitySlots.expertId, expertId),
					eq(availabilitySlots.booked, false),
					gt(availabilitySlots.startsAt, after),
				),
			)
			.orderBy(asc(availabilitySlots.startsAt));
		return rows.map(serializeSlot);
	}

	async createBooking(
		clientUserId: string,
		availabilitySlotId: number,
		now = new Date(),
	) {
		return this.database.transaction(async (transaction) => {
			const [slot] = await transaction
				.update(availabilitySlots)
				.set({ booked: true })
				.where(
					and(
						eq(availabilitySlots.id, availabilitySlotId),
						eq(availabilitySlots.booked, false),
						gt(availabilitySlots.startsAt, now),
					),
				)
				.returning();
			if (!slot) {
				throw new SlotUnavailableError();
			}

			const [expert] = await transaction
				.select()
				.from(experts)
				.where(eq(experts.id, slot.expertId))
				.limit(1);
			if (!expert) {
				throw new SlotUnavailableError();
			}

			const [booking] = await transaction
				.insert(bookings)
				.values({
					availabilitySlotId: slot.id,
					clientUserId,
					createdAt: now,
					endsAt: slot.endsAt,
					expertId: slot.expertId,
					id: randomUUID(),
					startsAt: slot.startsAt,
					status: "confirmed",
				})
				.returning();

			return serializeBooking(booking, expert);
		});
	}

	async listClientBookings(clientUserId: string) {
		const rows = await this.database
			.select({ booking: bookings, expert: experts })
			.from(bookings)
			.innerJoin(experts, eq(bookings.expertId, experts.id))
			.where(eq(bookings.clientUserId, clientUserId))
			.orderBy(asc(bookings.startsAt));
		return rows.map(({ booking, expert }) =>
			serializeBooking(booking, expert),
		);
	}
}

export type ExpertDto = Awaited<
	ReturnType<ConsultationService["listExperts"]>
>[number];
