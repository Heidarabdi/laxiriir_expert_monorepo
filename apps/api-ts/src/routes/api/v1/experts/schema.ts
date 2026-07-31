import { z } from "zod";

export const expertSchema = z.object({
	avatarUrl: z.string().url(),
	bio: z.string(),
	category: z.string(),
	createdAt: z.string().datetime(),
	displayName: z.string(),
	hourlyRateCents: z.number().int().nonnegative(),
	id: z.string(),
	title: z.string(),
	updatedAt: z.string().datetime(),
});

export const availabilitySchema = z.object({
	booked: z.boolean(),
	createdAt: z.string().datetime(),
	endsAt: z.string().datetime(),
	expertId: z.string(),
	id: z.number().int().positive(),
	startsAt: z.string().datetime(),
});
