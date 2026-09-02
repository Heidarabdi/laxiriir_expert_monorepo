import { randomUUID } from "node:crypto";
import type { ExpertStatus } from "@repo/contracts/auth";
import type {
	ExpertBookingScope,
	ExpertProfileInput,
} from "@repo/contracts/consultations";
import {
	and,
	asc,
	count,
	desc,
	eq,
	gt,
	gte,
	isNull,
	lt,
	lte,
	ne,
	or,
} from "drizzle-orm";

import { user } from "../db/auth-schema.ts";
import {
	availabilitySlots,
	bookings,
	experts,
} from "../db/consultation-schema.ts";
import { notifications } from "../db/engagement-schema.ts";
import type { AppDatabase } from "../db/postgres.js";

export class SlotUnavailableError extends Error {
	constructor() {
		super("availability slot is no longer available");
		this.name = "SlotUnavailableError";
	}
}

export class AvailabilityConflictError extends Error {
	constructor(message = "availability overlaps an existing slot") {
		super(message);
		this.name = "AvailabilityConflictError";
	}
}

export class AvailabilityNotFoundError extends Error {
	constructor() {
		super("availability slot not found");
		this.name = "AvailabilityNotFoundError";
	}
}

export class BookedAvailabilityError extends Error {
	constructor(message = "booked availability cannot be changed") {
		super(message);
		this.name = "BookedAvailabilityError";
	}
}

export class BookingNotFoundError extends Error {
	constructor() {
		super("booking not found");
		this.name = "BookingNotFoundError";
	}
}

export class BookingChangeConflictError extends Error {
	constructor(
		message = "booking can only be changed at least 24 hours before it starts",
	) {
		super(message);
		this.name = "BookingChangeConflictError";
	}
}

export class ExpertProfileNotFoundError extends Error {
	constructor() {
		super("expert profile not found");
		this.name = "ExpertProfileNotFoundError";
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
		status: booking.status as "cancelled" | "confirmed",
	};
}

function serializeExpertBooking(
	booking: typeof bookings.$inferSelect,
	client: { id: string; name: string } | null,
) {
	return {
		availabilitySlotId: booking.availabilitySlotId,
		client: {
			displayName: client?.name ?? null,
			id: booking.clientUserId,
		},
		createdAt: booking.createdAt.toISOString(),
		endsAt: booking.endsAt.toISOString(),
		id: booking.id,
		startsAt: booking.startsAt.toISOString(),
		status: booking.status as "cancelled" | "confirmed",
	};
}

const productionBookableExpertStatuses = [
	"approved",
] as const satisfies readonly ExpertStatus[];
const developmentBookableExpertStatuses = [
	...productionBookableExpertStatuses,
	"pending_review",
] as const satisfies readonly ExpertStatus[];

export class ConsultationService {
	private readonly database: AppDatabase;
	private readonly allowPendingExperts: boolean;

	constructor(
		database: AppDatabase,
		options: { allowPendingExperts?: boolean } = {},
	) {
		this.database = database;
		this.allowPendingExperts = options.allowPendingExperts ?? false;
	}

	private expertIdentityIsEligible() {
		return or(
			isNull(user.id),
			...this.bookableExpertStatuses().map((status) =>
				eq(user.expertStatus, status),
			),
		);
	}

	private bookableExpertStatuses(): readonly ExpertStatus[] {
		return this.allowPendingExperts
			? developmentBookableExpertStatuses
			: productionBookableExpertStatuses;
	}

	private expertStatusCanAcceptBookings(status: string) {
		return this.bookableExpertStatuses().some(
			(candidate) => candidate === status,
		);
	}

	private async identityCanAcceptBookings(
		database: Pick<AppDatabase, "select">,
		expertId: string,
	) {
		const [identity] = await database
			.select({ expertStatus: user.expertStatus })
			.from(user)
			.where(eq(user.id, expertId))
			.limit(1);
		return (
			!identity || this.expertStatusCanAcceptBookings(identity.expertStatus)
		);
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
				avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
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
			.select({ expert: experts })
			.from(experts)
			.leftJoin(user, eq(experts.id, user.id))
			.where(and(eq(experts.active, true), this.expertIdentityIsEligible()))
			.orderBy(asc(experts.displayName));
		return rows.map(({ expert }) => serializeExpert(expert));
	}

	async getExpertProfile(expertId: string) {
		const [expert] = await this.database
			.select()
			.from(experts)
			.where(eq(experts.id, expertId))
			.limit(1);
		if (!expert) throw new ExpertProfileNotFoundError();
		return serializeExpert(expert);
	}

	async updateExpertProfile(
		expertId: string,
		input: ExpertProfileInput,
		now = new Date(),
	) {
		return this.database.transaction(async (transaction) => {
			const [expert] = await transaction
				.update(experts)
				.set({ ...input, updatedAt: now })
				.where(and(eq(experts.id, expertId), eq(experts.active, true)))
				.returning();
			if (!expert) throw new ExpertProfileNotFoundError();
			await transaction
				.update(user)
				.set({ name: input.displayName, updatedAt: now })
				.where(eq(user.id, expertId));
			return serializeExpert(expert);
		});
	}

	async listAvailability(expertId: string, after = new Date()) {
		const rows = await this.database
			.select({ slot: availabilitySlots })
			.from(availabilitySlots)
			.innerJoin(experts, eq(availabilitySlots.expertId, experts.id))
			.leftJoin(user, eq(experts.id, user.id))
			.where(
				and(
					eq(availabilitySlots.expertId, expertId),
					eq(availabilitySlots.booked, false),
					eq(experts.active, true),
					this.expertIdentityIsEligible(),
					gt(availabilitySlots.startsAt, after),
				),
			)
			.orderBy(asc(availabilitySlots.startsAt));
		return rows.map(({ slot }) => serializeSlot(slot));
	}

	async listExpertAvailability(expertId: string, after = new Date()) {
		const rows = await this.database
			.select()
			.from(availabilitySlots)
			.where(
				and(
					eq(availabilitySlots.expertId, expertId),
					gt(availabilitySlots.endsAt, after),
				),
			)
			.orderBy(asc(availabilitySlots.startsAt));
		return rows.map(serializeSlot);
	}

	async createAvailability(
		expertId: string,
		startsAt: Date,
		endsAt: Date,
		now = new Date(),
	) {
		if (startsAt <= now) {
			throw new AvailabilityConflictError(
				"availability must start in the future",
			);
		}

		return this.database.transaction(async (transaction) => {
			const [expert] = await transaction
				.select({ id: experts.id })
				.from(experts)
				.where(and(eq(experts.id, expertId), eq(experts.active, true)))
				.for("update")
				.limit(1);
			if (!expert) throw new AvailabilityNotFoundError();

			await this.assertNoAvailabilityOverlap(
				transaction,
				expertId,
				startsAt,
				endsAt,
			);
			const [slot] = await transaction
				.insert(availabilitySlots)
				.values({ expertId, startsAt, endsAt, createdAt: now })
				.returning();
			return serializeSlot(slot);
		});
	}

	async updateAvailability(
		expertId: string,
		slotId: number,
		startsAt: Date,
		endsAt: Date,
		now = new Date(),
	) {
		if (startsAt <= now) {
			throw new AvailabilityConflictError(
				"availability must start in the future",
			);
		}

		return this.database.transaction(async (transaction) => {
			const [expert] = await transaction
				.select({ id: experts.id })
				.from(experts)
				.where(and(eq(experts.id, expertId), eq(experts.active, true)))
				.for("update")
				.limit(1);
			if (!expert) throw new AvailabilityNotFoundError();

			const [existing] = await transaction
				.select()
				.from(availabilitySlots)
				.where(
					and(
						eq(availabilitySlots.id, slotId),
						eq(availabilitySlots.expertId, expertId),
					),
				)
				.limit(1);
			if (!existing) throw new AvailabilityNotFoundError();
			if (existing.booked) throw new BookedAvailabilityError();

			await this.assertNoAvailabilityOverlap(
				transaction,
				expertId,
				startsAt,
				endsAt,
				slotId,
			);
			const [slot] = await transaction
				.update(availabilitySlots)
				.set({ startsAt, endsAt })
				.where(
					and(
						eq(availabilitySlots.id, slotId),
						eq(availabilitySlots.expertId, expertId),
						eq(availabilitySlots.booked, false),
					),
				)
				.returning();
			if (!slot) throw new BookedAvailabilityError();
			return serializeSlot(slot);
		});
	}

	async deleteAvailability(expertId: string, slotId: number) {
		await this.database.transaction(async (transaction) => {
			const [expert] = await transaction
				.select({ id: experts.id })
				.from(experts)
				.where(and(eq(experts.id, expertId), eq(experts.active, true)))
				.for("update")
				.limit(1);
			if (!expert) throw new AvailabilityNotFoundError();
			const [bookingHistory] = await transaction
				.select({ id: bookings.id })
				.from(bookings)
				.where(eq(bookings.availabilitySlotId, slotId))
				.limit(1);
			if (bookingHistory) {
				throw new BookedAvailabilityError(
					"availability with booking history cannot be deleted",
				);
			}

			const [deleted] = await transaction
				.delete(availabilitySlots)
				.where(
					and(
						eq(availabilitySlots.id, slotId),
						eq(availabilitySlots.expertId, expertId),
						eq(availabilitySlots.booked, false),
					),
				)
				.returning({ id: availabilitySlots.id });
			if (deleted) return;

			const [existing] = await transaction
				.select({ booked: availabilitySlots.booked })
				.from(availabilitySlots)
				.where(
					and(
						eq(availabilitySlots.id, slotId),
						eq(availabilitySlots.expertId, expertId),
					),
				)
				.limit(1);
			if (!existing) throw new AvailabilityNotFoundError();
			throw new BookedAvailabilityError();
		});
	}

	private async assertNoAvailabilityOverlap(
		database: Pick<AppDatabase, "select">,
		expertId: string,
		startsAt: Date,
		endsAt: Date,
		excludedSlotId?: number,
	) {
		const predicates = [
			eq(availabilitySlots.expertId, expertId),
			lt(availabilitySlots.startsAt, endsAt),
			gt(availabilitySlots.endsAt, startsAt),
		];
		if (excludedSlotId !== undefined) {
			predicates.push(ne(availabilitySlots.id, excludedSlotId));
		}
		const [overlap] = await database
			.select({ id: availabilitySlots.id })
			.from(availabilitySlots)
			.where(and(...predicates))
			.limit(1);
		if (overlap) throw new AvailabilityConflictError();
	}

	async createBooking(
		clientUserId: string,
		availabilitySlotId: number,
		now = new Date(),
	) {
		return this.database.transaction(async (transaction) => {
			const [candidate] = await transaction
				.select({ expertId: availabilitySlots.expertId })
				.from(availabilitySlots)
				.where(eq(availabilitySlots.id, availabilitySlotId))
				.limit(1);
			if (!candidate) throw new SlotUnavailableError();
			if (
				!(await this.identityCanAcceptBookings(transaction, candidate.expertId))
			) {
				throw new SlotUnavailableError();
			}

			const [expert] = await transaction
				.select()
				.from(experts)
				.where(
					and(eq(experts.id, candidate.expertId), eq(experts.active, true)),
				)
				.for("update")
				.limit(1);
			if (!expert) throw new SlotUnavailableError();

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

			const [recipient] = await transaction
				.select({ id: user.id })
				.from(user)
				.where(eq(user.id, clientUserId))
				.limit(1);
			if (recipient) {
				await transaction.insert(notifications).values({
					href: `/client/bookings/${booking.id}`,
					id: randomUUID(),
					message: `Your session with ${expert.displayName} is scheduled for ${slot.startsAt.toISOString()}.`,
					title: "Booking confirmed",
					type: "booking_confirmed",
					userId: clientUserId,
				});
			}
			const [expertRecipient] = await transaction
				.select({ id: user.id })
				.from(user)
				.where(eq(user.id, expert.id))
				.limit(1);
			if (expertRecipient) {
				await transaction.insert(notifications).values({
					href: "/expert/sessions",
					id: randomUUID(),
					message: `A client booked your ${slot.startsAt.toISOString()} session.`,
					title: "New booking",
					type: "booking_confirmed",
					userId: expert.id,
				});
			}

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
		return rows.map(({ booking, expert }) => serializeBooking(booking, expert));
	}

	async listAdminBookings() {
		const rows = await this.database
			.select({ booking: bookings, client: user, expert: experts })
			.from(bookings)
			.innerJoin(experts, eq(bookings.expertId, experts.id))
			.innerJoin(user, eq(bookings.clientUserId, user.id))
			.orderBy(desc(bookings.startsAt));
		return rows.map(({ booking, client, expert }) => ({
			client: {
				displayName: client.name,
				email: client.email,
				id: client.id,
			},
			createdAt: booking.createdAt.toISOString(),
			endsAt: booking.endsAt.toISOString(),
			expert: serializeExpert(expert),
			id: booking.id,
			startsAt: booking.startsAt.toISOString(),
			status: booking.status as "cancelled" | "confirmed",
		}));
	}

	async listExpertBookings(
		expertId: string,
		scope: ExpertBookingScope,
		now = new Date(),
	) {
		const scopeFilter =
			scope === "upcoming"
				? and(eq(bookings.status, "confirmed"), gt(bookings.endsAt, now))
				: or(lte(bookings.endsAt, now), eq(bookings.status, "cancelled"));
		const rows = await this.database
			.select({
				booking: bookings,
				client: { id: user.id, name: user.name },
			})
			.from(bookings)
			.leftJoin(user, eq(bookings.clientUserId, user.id))
			.where(and(eq(bookings.expertId, expertId), scopeFilter))
			.orderBy(
				scope === "upcoming" ? asc(bookings.startsAt) : desc(bookings.startsAt),
			);
		return rows.map(({ booking, client }) =>
			serializeExpertBooking(booking, client),
		);
	}

	async getExpertDashboardSummary(expertId: string, now = new Date()) {
		const [upcoming, past, [openAvailability]] = await Promise.all([
			this.listExpertBookings(expertId, "upcoming", now),
			this.listExpertBookings(expertId, "past", now),
			this.database
				.select({ total: count() })
				.from(availabilitySlots)
				.where(
					and(
						eq(availabilitySlots.expertId, expertId),
						eq(availabilitySlots.booked, false),
						gt(availabilitySlots.endsAt, now),
					),
				),
		]);

		return {
			nextBooking: upcoming[0] ?? null,
			openAvailability: openAvailability?.total ?? 0,
			pastBookings: past.length,
			upcomingBookings: upcoming.length,
		};
	}

	async cancelBooking(
		clientUserId: string,
		bookingId: string,
		now = new Date(),
	) {
		return this.database.transaction(async (transaction) => {
			const [candidate] = await transaction
				.select({ expertId: bookings.expertId })
				.from(bookings)
				.where(
					and(
						eq(bookings.id, bookingId),
						eq(bookings.clientUserId, clientUserId),
					),
				)
				.limit(1);
			if (!candidate) throw new BookingNotFoundError();

			const [expert] = await transaction
				.select()
				.from(experts)
				.where(eq(experts.id, candidate.expertId))
				.for("update")
				.limit(1);
			if (!expert) throw new BookingNotFoundError();

			const [booking] = await transaction
				.select()
				.from(bookings)
				.where(
					and(
						eq(bookings.id, bookingId),
						eq(bookings.clientUserId, clientUserId),
					),
				)
				.limit(1);
			if (!booking) throw new BookingNotFoundError();
			this.assertBookingChangeAllowed(booking, now);

			const [cancelled] = await transaction
				.update(bookings)
				.set({ status: "cancelled" })
				.where(
					and(
						eq(bookings.id, bookingId),
						eq(bookings.clientUserId, clientUserId),
						eq(bookings.status, "confirmed"),
					),
				)
				.returning();
			if (!cancelled) throw new BookingChangeConflictError();

			await transaction
				.update(availabilitySlots)
				.set({ booked: false })
				.where(eq(availabilitySlots.id, booking.availabilitySlotId));

			const [recipient] = await transaction
				.select({ id: user.id })
				.from(user)
				.where(eq(user.id, clientUserId))
				.limit(1);
			if (recipient) {
				await transaction.insert(notifications).values({
					href: `/client/bookings/${cancelled.id}`,
					id: randomUUID(),
					message: `Your session with ${expert.displayName} was cancelled.`,
					title: "Booking cancelled",
					type: "booking_cancelled",
					userId: clientUserId,
				});
			}
			const [expertRecipient] = await transaction
				.select({ id: user.id })
				.from(user)
				.where(eq(user.id, expert.id))
				.limit(1);
			if (expertRecipient) {
				await transaction.insert(notifications).values({
					href: "/expert/sessions",
					id: randomUUID(),
					message: `A client cancelled the ${booking.startsAt.toISOString()} session.`,
					title: "Booking cancelled",
					type: "booking_cancelled",
					userId: expert.id,
				});
			}

			return serializeBooking(cancelled, expert);
		});
	}

	async rescheduleBooking(
		clientUserId: string,
		bookingId: string,
		availabilitySlotId: number,
		now = new Date(),
	) {
		return this.database.transaction(async (transaction) => {
			const [candidate] = await transaction
				.select({ expertId: bookings.expertId })
				.from(bookings)
				.where(
					and(
						eq(bookings.id, bookingId),
						eq(bookings.clientUserId, clientUserId),
					),
				)
				.limit(1);
			if (!candidate) throw new BookingNotFoundError();
			if (
				!(await this.identityCanAcceptBookings(transaction, candidate.expertId))
			) {
				throw new BookingChangeConflictError(
					"expert is not accepting bookings",
				);
			}

			const [expert] = await transaction
				.select()
				.from(experts)
				.where(
					and(eq(experts.id, candidate.expertId), eq(experts.active, true)),
				)
				.for("update")
				.limit(1);
			if (!expert) {
				throw new BookingChangeConflictError(
					"expert is not accepting bookings",
				);
			}

			const [booking] = await transaction
				.select()
				.from(bookings)
				.where(
					and(
						eq(bookings.id, bookingId),
						eq(bookings.clientUserId, clientUserId),
					),
				)
				.limit(1);
			if (!booking) throw new BookingNotFoundError();
			this.assertBookingChangeAllowed(booking, now);

			const policyDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
			const [replacement] = await transaction
				.update(availabilitySlots)
				.set({ booked: true })
				.where(
					and(
						eq(availabilitySlots.id, availabilitySlotId),
						eq(availabilitySlots.expertId, booking.expertId),
						eq(availabilitySlots.booked, false),
						gte(availabilitySlots.startsAt, policyDeadline),
					),
				)
				.returning();
			if (!replacement) {
				throw new BookingChangeConflictError(
					"replacement availability slot is no longer available",
				);
			}

			const [rescheduled] = await transaction
				.update(bookings)
				.set({
					availabilitySlotId: replacement.id,
					endsAt: replacement.endsAt,
					startsAt: replacement.startsAt,
				})
				.where(
					and(
						eq(bookings.id, bookingId),
						eq(bookings.clientUserId, clientUserId),
						eq(bookings.status, "confirmed"),
					),
				)
				.returning();
			if (!rescheduled) throw new BookingChangeConflictError();

			await transaction
				.update(availabilitySlots)
				.set({ booked: false })
				.where(eq(availabilitySlots.id, booking.availabilitySlotId));

			const [recipient] = await transaction
				.select({ id: user.id })
				.from(user)
				.where(eq(user.id, clientUserId))
				.limit(1);
			if (recipient) {
				await transaction.insert(notifications).values({
					href: `/client/bookings/${rescheduled.id}`,
					id: randomUUID(),
					message: `Your session with ${expert.displayName} was moved to ${replacement.startsAt.toISOString()}.`,
					title: "Booking rescheduled",
					type: "booking_rescheduled",
					userId: clientUserId,
				});
			}
			const [expertRecipient] = await transaction
				.select({ id: user.id })
				.from(user)
				.where(eq(user.id, expert.id))
				.limit(1);
			if (expertRecipient) {
				await transaction.insert(notifications).values({
					href: "/expert/sessions",
					id: randomUUID(),
					message: `A client moved their session to ${replacement.startsAt.toISOString()}.`,
					title: "Booking rescheduled",
					type: "booking_rescheduled",
					userId: expert.id,
				});
			}

			return serializeBooking(rescheduled, expert);
		});
	}

	private assertBookingChangeAllowed(
		booking: typeof bookings.$inferSelect,
		now: Date,
	) {
		if (booking.status !== "confirmed") {
			throw new BookingChangeConflictError("booking is not confirmed");
		}
		const policyDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000);
		if (booking.startsAt < policyDeadline) {
			throw new BookingChangeConflictError();
		}
	}
}

export type ExpertDto = Awaited<
	ReturnType<ConsultationService["listExperts"]>
>[number];
