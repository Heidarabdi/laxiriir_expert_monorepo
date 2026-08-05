import { z } from "zod";

export const availabilitySlotSchema = z.object({
	booked: z.boolean(),
	createdAt: z.string().datetime(),
	endsAt: z.string().datetime(),
	expertId: z.string(),
	id: z.number().int().positive(),
	startsAt: z.string().datetime(),
});

export const availabilityInputSchema = z
	.object({
		endsAt: z.string().datetime(),
		startsAt: z.string().datetime(),
	})
	.refine((input) => new Date(input.endsAt) > new Date(input.startsAt), {
		message: "endsAt must be after startsAt",
		path: ["endsAt"],
	});

export const availabilityParamsSchema = z.object({
	id: z.coerce.number().int().positive(),
});
