import { z } from "zod";

export const bookingStatusSchema = z.enum(["cancelled", "confirmed"]);
export type BookingStatus = z.infer<typeof bookingStatusSchema>;

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
export type ExpertSummary = z.infer<typeof expertSchema>;

export const availabilitySlotSchema = z.object({
	booked: z.boolean(),
	createdAt: z.string().datetime(),
	endsAt: z.string().datetime(),
	expertId: z.string(),
	id: z.number().int().positive(),
	startsAt: z.string().datetime(),
});
export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>;

export const bookingSchema = z.object({
	availabilitySlotId: z.number().int().positive(),
	clientUserId: z.string(),
	createdAt: z.string().datetime(),
	endsAt: z.string().datetime(),
	expert: expertSchema,
	id: z.string(),
	startsAt: z.string().datetime(),
	status: bookingStatusSchema,
});
export type BookingDetail = z.infer<typeof bookingSchema>;

export const expertListResponseSchema = z.object({
	experts: z.array(expertSchema),
});
export type ExpertListResponse = z.infer<typeof expertListResponseSchema>;

export const availabilityListResponseSchema = z.object({
	slots: z.array(availabilitySlotSchema),
});
export type AvailabilityListResponse = z.infer<
	typeof availabilityListResponseSchema
>;

export const availabilityResponseSchema = z.object({
	slot: availabilitySlotSchema,
});
export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>;

export const bookingResponseSchema = z.object({ booking: bookingSchema });
export type BookingResponse = z.infer<typeof bookingResponseSchema>;

export const bookingListResponseSchema = z.object({
	bookings: z.array(bookingSchema),
});
export type BookingListResponse = z.infer<typeof bookingListResponseSchema>;

export const expertBookingScopeSchema = z.enum(["upcoming", "past"]);
export type ExpertBookingScope = z.infer<typeof expertBookingScopeSchema>;

export const expertBookingQuerySchema = z.object({
	scope: expertBookingScopeSchema.default("upcoming"),
});

export const expertBookingSchema = z.object({
	availabilitySlotId: z.number().int().positive(),
	client: z.object({
		displayName: z.string().nullable(),
		id: z.string(),
	}),
	createdAt: z.string().datetime(),
	endsAt: z.string().datetime(),
	id: z.string(),
	startsAt: z.string().datetime(),
	status: bookingStatusSchema,
});
export type ExpertBookingDetail = z.infer<typeof expertBookingSchema>;

export const expertBookingListResponseSchema = z.object({
	bookings: z.array(expertBookingSchema),
});
export type ExpertBookingListResponse = z.infer<
	typeof expertBookingListResponseSchema
>;

export const expertDashboardSummarySchema = z.object({
	nextBooking: expertBookingSchema.nullable(),
	openAvailability: z.number().int().nonnegative(),
	pastBookings: z.number().int().nonnegative(),
	upcomingBookings: z.number().int().nonnegative(),
});
export type ExpertDashboardSummary = z.infer<
	typeof expertDashboardSummarySchema
>;

export const createBookingInputSchema = z.object({
	availabilitySlotId: z.number().int().positive(),
});
export type CreateBookingInput = z.infer<typeof createBookingInputSchema>;

export const availabilityInputSchema = z
	.object({
		endsAt: z.string().datetime(),
		startsAt: z.string().datetime(),
	})
	.refine((input) => new Date(input.endsAt) > new Date(input.startsAt), {
		message: "endsAt must be after startsAt",
		path: ["endsAt"],
	});
export type AvailabilityInput = z.infer<typeof availabilityInputSchema>;

export const expertParamsSchema = z.object({
	id: z.string().trim().min(1),
});

export const bookingParamsSchema = z.object({
	id: z.string().trim().min(1),
});

export const availabilityParamsSchema = z.object({
	id: z.coerce.number().int().positive(),
});

export const errorResponseSchema = z.object({ message: z.string() });
export type ErrorResponse = z.infer<typeof errorResponseSchema>;

export const emptyResponseSchema = z.null();
