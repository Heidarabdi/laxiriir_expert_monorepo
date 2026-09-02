import { and, eq, gte, inArray, lte } from "drizzle-orm";

import type { AppAuth } from "../auth/factory.js";
import { developmentDemoPasswordSchema } from "../config.js";
import { account, session, user } from "./auth-schema.js";
import { availabilitySlots, bookings, experts } from "./consultation-schema.js";
import type { AppDatabase } from "./postgres.js";

export const DEVELOPMENT_DEMO_ACCOUNTS = [
	{
		email: "client@laxiriir.local",
		expertStatus: "not_applicable",
		key: "client",
		name: "Amina Yusuf",
		role: "client",
		signUpRole: "client",
	},
	{
		email: "expert@laxiriir.local",
		expertStatus: "approved",
		key: "expert",
		name: "Dr. Nadiya Hassan",
		role: "expert",
		signUpRole: "expert",
	},
	{
		email: "expert.operations@laxiriir.local",
		expertStatus: "approved",
		key: "operationsExpert",
		name: "Abdi Warsame",
		role: "expert",
		signUpRole: "expert",
	},
	{
		email: "pending.expert@laxiriir.local",
		expertStatus: "pending_review",
		key: "pendingExpert",
		name: "Jamal Osman",
		role: "expert",
		signUpRole: "expert",
	},
	{
		email: "rejected.expert@laxiriir.local",
		expertStatus: "rejected",
		key: "rejectedExpert",
		name: "Leyla Noor",
		role: "expert",
		signUpRole: "expert",
	},
	{
		email: "suspended.expert@laxiriir.local",
		expertStatus: "suspended",
		key: "suspendedExpert",
		name: "Farah Ali",
		role: "expert",
		signUpRole: "expert",
	},
	{
		email: "admin@laxiriir.local",
		expertStatus: "not_applicable",
		key: "admin",
		name: "Omar Hassan",
		role: "admin",
		signUpRole: "client",
	},
] as const;

type DemoAccount = (typeof DEVELOPMENT_DEMO_ACCOUNTS)[number];
type DemoAccountKey = DemoAccount["key"];

function startOfNextUtcWeek(now: Date) {
	const date = new Date(now);
	date.setUTCHours(0, 0, 0, 0);
	const dayFromMonday = (date.getUTCDay() + 6) % 7;
	date.setUTCDate(date.getUTCDate() - dayFromMonday + 7);
	return date;
}

function atOffset(anchor: Date, dayOffset: number, hour: number) {
	const date = new Date(anchor);
	date.setUTCDate(date.getUTCDate() + dayOffset);
	date.setUTCHours(hour, 0, 0, 0);
	return date;
}

async function ensureIdentity(
	database: AppDatabase,
	auth: AppAuth,
	demoAccount: DemoAccount,
	password: string,
) {
	let [identity] = await database
		.select()
		.from(user)
		.where(eq(user.email, demoAccount.email))
		.limit(1);

	if (!identity) {
		await auth.api.signUpEmail({
			body: {
				email: demoAccount.email,
				name: demoAccount.name,
				password,
				role: demoAccount.signUpRole,
			},
		});
		[identity] = await database
			.select()
			.from(user)
			.where(eq(user.email, demoAccount.email))
			.limit(1);
	}

	if (!identity) {
		throw new Error(
			`Unable to create development identity ${demoAccount.email}`,
		);
	}

	await database
		.update(user)
		.set({
			emailVerified: true,
			expertStatus: demoAccount.expertStatus,
			name: demoAccount.name,
			role: demoAccount.role,
			updatedAt: new Date(),
		})
		.where(eq(user.id, identity.id));

	const [credential] = await database
		.select({ id: account.id, password: account.password })
		.from(account)
		.where(
			and(
				eq(account.userId, identity.id),
				eq(account.providerId, "credential"),
			),
		)
		.limit(1);
	if (!credential) {
		throw new Error(
			`Development identity ${demoAccount.email} is missing a credential account`,
		);
	}

	const context = await auth.$context;
	if (
		!credential.password ||
		!(await context.password.verify({ hash: credential.password, password }))
	) {
		const hash = await context.password.hash(password);
		// Rotate existing demo credentials as well as new accounts. Revoke only
		// this identity's sessions, atomically with the credential update.
		await database.transaction(async (transaction) => {
			await transaction
				.update(account)
				.set({ password: hash, updatedAt: new Date() })
				.where(eq(account.id, credential.id));
			await transaction.delete(session).where(eq(session.userId, identity.id));
		});
	}

	return identity.id;
}

export async function seedDevelopmentWorkspace(
	database: AppDatabase,
	auth: AppAuth,
	options: { password: string },
	now = new Date(),
) {
	const password = developmentDemoPasswordSchema.parse(options.password);
	const identities = new Map<DemoAccountKey, string>();
	for (const demoAccount of DEVELOPMENT_DEMO_ACCOUNTS) {
		identities.set(
			demoAccount.key,
			await ensureIdentity(database, auth, demoAccount, password),
		);
	}

	const expertProfiles = [
		{
			avatarUrl:
				"https://api.dicebear.com/9.x/avataaars/svg?seed=Nadiya-Hassan",
			bio: "Product and growth advisor helping early-stage teams validate markets, prioritize roadmaps, and turn customer evidence into focused execution.",
			category: "Strategy",
			displayName: "Dr. Nadiya Hassan",
			hourlyRateCents: 32_500,
			identityKey: "expert" as const,
			title: "Product Strategy Advisor",
		},
		{
			avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Abdi-Warsame",
			bio: "Operations consultant supporting service businesses with repeatable delivery systems, capacity planning, and practical team workflows.",
			category: "Operations",
			displayName: "Abdi Warsame",
			hourlyRateCents: 28_000,
			identityKey: "operationsExpert" as const,
			title: "Operations Consultant",
		},
		{
			avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jamal-Osman",
			bio: "Leadership coach applying for marketplace review.",
			category: "Leadership",
			displayName: "Jamal Osman",
			hourlyRateCents: 22_000,
			identityKey: "pendingExpert" as const,
			title: "Leadership Coach",
		},
		{
			avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Leyla-Noor",
			bio: "Marketing consultant whose application was not approved.",
			category: "Marketing",
			displayName: "Leyla Noor",
			hourlyRateCents: 20_000,
			identityKey: "rejectedExpert" as const,
			title: "Marketing Consultant",
		},
		{
			avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Farah-Ali",
			bio: "Financial planning expert with temporarily suspended marketplace access.",
			category: "Finance",
			displayName: "Farah Ali",
			hourlyRateCents: 30_000,
			identityKey: "suspendedExpert" as const,
			title: "Financial Planning Expert",
		},
	];

	for (const profile of expertProfiles) {
		const id = identities.get(profile.identityKey);
		if (!id)
			throw new Error(`Missing development identity ${profile.identityKey}`);
		await database
			.insert(experts)
			.values({
				active: true,
				avatarUrl: profile.avatarUrl,
				bio: profile.bio,
				category: profile.category,
				createdAt: now,
				displayName: profile.displayName,
				hourlyRateCents: profile.hourlyRateCents,
				id,
				title: profile.title,
				updatedAt: now,
			})
			.onConflictDoUpdate({
				set: {
					active: true,
					avatarUrl: profile.avatarUrl,
					bio: profile.bio,
					category: profile.category,
					displayName: profile.displayName,
					hourlyRateCents: profile.hourlyRateCents,
					title: profile.title,
					updatedAt: now,
				},
				target: experts.id,
			});
	}

	const primaryExpertId = identities.get("expert");
	const operationsExpertId = identities.get("operationsExpert");
	const clientId = identities.get("client");
	if (!(primaryExpertId && operationsExpertId && clientId)) {
		throw new Error("Development seed identities are incomplete");
	}

	const nextWeek = startOfNextUtcWeek(now);
	const weekKey = nextWeek.toISOString().slice(0, 10);
	const schedule = [
		{ day: -17, expertId: primaryExpertId, hour: 10, key: "nadiya-past-older" },
		{
			day: -10,
			expertId: primaryExpertId,
			hour: 14,
			key: "nadiya-past-recent",
		},
		{ day: -8, expertId: primaryExpertId, hour: 11, key: "nadiya-cancelled" },
		{ day: 1, expertId: primaryExpertId, hour: 9, key: "nadiya-upcoming-one" },
		{ day: 3, expertId: primaryExpertId, hour: 13, key: "nadiya-upcoming-two" },
		{ day: 2, expertId: primaryExpertId, hour: 11, key: "nadiya-open-one" },
		{ day: 4, expertId: primaryExpertId, hour: 15, key: "nadiya-open-two" },
		{ day: 8, expertId: primaryExpertId, hour: 10, key: "nadiya-open-three" },
		{ day: 11, expertId: primaryExpertId, hour: 14, key: "nadiya-open-four" },
		{ day: -12, expertId: operationsExpertId, hour: 12, key: "abdi-past" },
		{ day: 2, expertId: operationsExpertId, hour: 9, key: "abdi-upcoming" },
		{ day: 1, expertId: operationsExpertId, hour: 14, key: "abdi-open-one" },
		{ day: 4, expertId: operationsExpertId, hour: 10, key: "abdi-open-two" },
		{ day: 7, expertId: operationsExpertId, hour: 16, key: "abdi-open-three" },
	] as const;
	const slotValues = schedule.map((slot) => {
		const startsAt = atOffset(nextWeek, slot.day, slot.hour);
		return {
			booked: false,
			createdAt: now,
			endsAt: new Date(startsAt.getTime() + 60 * 60 * 1000),
			expertId: slot.expertId,
			startsAt,
		};
	});
	await database
		.insert(availabilitySlots)
		.values(slotValues)
		.onConflictDoNothing();

	const rangeStart = atOffset(nextWeek, -18, 0);
	const rangeEnd = atOffset(nextWeek, 12, 23);
	const storedSlots = await database
		.select()
		.from(availabilitySlots)
		.where(
			and(
				inArray(availabilitySlots.expertId, [
					primaryExpertId,
					operationsExpertId,
				]),
				gte(availabilitySlots.startsAt, rangeStart),
				lte(availabilitySlots.startsAt, rangeEnd),
			),
		);
	const slotsByKey = new Map(
		schedule.map((planned) => {
			const startsAt = atOffset(nextWeek, planned.day, planned.hour);
			const stored = storedSlots.find(
				(slot) =>
					slot.expertId === planned.expertId &&
					slot.startsAt.getTime() === startsAt.getTime(),
			);
			if (!stored) throw new Error(`Missing development slot ${planned.key}`);
			return [planned.key, stored] as const;
		}),
	);

	const bookingPlan = [
		{ key: "nadiya-past-older", status: "confirmed" },
		{ key: "nadiya-past-recent", status: "confirmed" },
		{ key: "nadiya-cancelled", status: "cancelled" },
		{ key: "nadiya-upcoming-one", status: "confirmed" },
		{ key: "nadiya-upcoming-two", status: "confirmed" },
		{ key: "abdi-past", status: "confirmed" },
		{ key: "abdi-upcoming", status: "confirmed" },
	] as const;

	for (const plannedBooking of bookingPlan) {
		const slot = slotsByKey.get(plannedBooking.key);
		if (!slot) throw new Error(`Missing booking slot ${plannedBooking.key}`);
		await database
			.insert(bookings)
			.values({
				availabilitySlotId: slot.id,
				clientUserId: clientId,
				createdAt: new Date(slot.startsAt.getTime() - 5 * 24 * 60 * 60 * 1000),
				endsAt: slot.endsAt,
				expertId: slot.expertId,
				id: `development-${weekKey}-${plannedBooking.key}`,
				startsAt: slot.startsAt,
				status: plannedBooking.status,
			})
			.onConflictDoNothing();
		if (plannedBooking.status === "confirmed") {
			await database
				.update(availabilitySlots)
				.set({ booked: true })
				.where(eq(availabilitySlots.id, slot.id));
		}
	}

	return {
		accounts: DEVELOPMENT_DEMO_ACCOUNTS.length,
		bookings: bookingPlan.length,
		slots: schedule.length,
		weekKey,
	};
}
