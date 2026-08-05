import type {
	PlatformFetch,
	PlatformRequestCredentials,
	PlatformRequestOptions,
} from "./auth";
import { joinApiUrl } from "./health";

export const EXPERTS_PATH = "/api/v1/experts";
export const CLIENT_BOOKINGS_PATH = "/api/v1/client/bookings";
export const EXPERT_AVAILABILITY_PATH = "/api/v1/expert/availability";

export type BookingStatus = "cancelled" | "confirmed";

export interface ExpertSummary {
	avatarUrl: string;
	bio: string;
	category: string;
	createdAt: string;
	displayName: string;
	hourlyRateCents: number;
	id: string;
	title: string;
	updatedAt: string;
}

export interface AvailabilitySlot {
	booked: boolean;
	createdAt: string;
	endsAt: string;
	expertId: string;
	id: number;
	startsAt: string;
}

export interface BookingDetail {
	availabilitySlotId: number;
	clientUserId: string;
	createdAt: string;
	endsAt: string;
	expert: ExpertSummary;
	id: string;
	startsAt: string;
	status: BookingStatus;
}

export interface ExpertListResponse {
	experts: ExpertSummary[];
}

export interface AvailabilityListResponse {
	slots: AvailabilitySlot[];
}

export interface BookingResponse {
	booking: BookingDetail;
}

export interface BookingListResponse {
	bookings: BookingDetail[];
}

export interface CreateBookingInput {
	availabilitySlotId: number;
}

export interface AvailabilityInput {
	endsAt: string;
	startsAt: string;
}

export interface PlatformConsultationClientOptions {
	apiBaseUrl: string;
	credentials?: PlatformRequestCredentials;
	fetch: PlatformFetch;
}

export function getExpertsUrl(apiBaseUrl: string) {
	return joinApiUrl(apiBaseUrl, EXPERTS_PATH);
}

export function getExpertAvailabilityUrl(apiBaseUrl: string, expertId: string) {
	return joinApiUrl(
		apiBaseUrl,
		`${EXPERTS_PATH}/${encodeURIComponent(expertId)}/availability`,
	);
}

export function getClientBookingsUrl(apiBaseUrl: string) {
	return joinApiUrl(apiBaseUrl, CLIENT_BOOKINGS_PATH);
}

export function getClientBookingUrl(apiBaseUrl: string, bookingId: string) {
	return joinApiUrl(
		apiBaseUrl,
		`${CLIENT_BOOKINGS_PATH}/${encodeURIComponent(bookingId)}`,
	);
}

export function getOwnAvailabilityUrl(apiBaseUrl: string, slotId?: number) {
	return joinApiUrl(
		apiBaseUrl,
		slotId === undefined
			? EXPERT_AVAILABILITY_PATH
			: `${EXPERT_AVAILABILITY_PATH}/${slotId}`,
	);
}

export function createPlatformConsultationClient(
	options: PlatformConsultationClientOptions,
) {
	const request = <TResponse>(
		url: string,
		requestOptions?: PlatformRequestOptions,
	) =>
		options.fetch<TResponse>(url, {
			...requestOptions,
			credentials:
				requestOptions?.credentials ?? options.credentials ?? "include",
		});

	return {
		cancelBooking(bookingId: string) {
			return request<BookingResponse>(
				getClientBookingUrl(options.apiBaseUrl, bookingId),
				{ method: "DELETE" },
			);
		},
		createAvailability(input: AvailabilityInput) {
			return request<{ slot: AvailabilitySlot }>(
				getOwnAvailabilityUrl(options.apiBaseUrl),
				{ body: input, method: "POST" },
			);
		},
		createBooking(input: CreateBookingInput) {
			return request<BookingResponse>(
				getClientBookingsUrl(options.apiBaseUrl),
				{
					body: input,
					method: "POST",
				},
			);
		},
		deleteAvailability(slotId: number) {
			return request<void>(getOwnAvailabilityUrl(options.apiBaseUrl, slotId), {
				method: "DELETE",
			});
		},
		listAvailability(expertId: string) {
			return request<AvailabilityListResponse>(
				getExpertAvailabilityUrl(options.apiBaseUrl, expertId),
			);
		},
		listOwnAvailability() {
			return request<AvailabilityListResponse>(
				getOwnAvailabilityUrl(options.apiBaseUrl),
			);
		},
		listBookings() {
			return request<BookingListResponse>(
				getClientBookingsUrl(options.apiBaseUrl),
			);
		},
		listExperts() {
			return request<ExpertListResponse>(getExpertsUrl(options.apiBaseUrl));
		},
		rescheduleBooking(bookingId: string, input: CreateBookingInput) {
			return request<BookingResponse>(
				getClientBookingUrl(options.apiBaseUrl, bookingId),
				{ body: input, method: "PATCH" },
			);
		},
		updateAvailability(slotId: number, input: AvailabilityInput) {
			return request<{ slot: AvailabilitySlot }>(
				getOwnAvailabilityUrl(options.apiBaseUrl, slotId),
				{ body: input, method: "PATCH" },
			);
		},
	};
}
