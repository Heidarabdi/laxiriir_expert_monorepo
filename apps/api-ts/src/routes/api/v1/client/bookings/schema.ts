import { z } from "zod";

import { expertSchema } from "../../experts/schema.ts";

export const bookingSchema = z.object({
	availabilitySlotId: z.number().int().positive(),
	clientUserId: z.string(),
	createdAt: z.string().datetime(),
	endsAt: z.string().datetime(),
	expert: expertSchema,
	id: z.string(),
	startsAt: z.string().datetime(),
	status: z.enum(["cancelled", "confirmed"]),
});

export const errorSchema = z.object({ message: z.string() });
export const bookingParamsSchema = z.object({ id: z.string().trim().min(1) });
