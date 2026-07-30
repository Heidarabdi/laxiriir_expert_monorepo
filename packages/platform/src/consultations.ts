import type {
	PlatformFetch,
	PlatformRequestCredentials,
	PlatformRequestOptions,
} from "./auth";
import { joinApiUrl } from "./health";

export const EXPERTS_PATH = "/api/v1/experts";
export const CLIENT_BOOKINGS_PATH = "/api/v1/client/bookings";

export type BookingStatus = "confirmed";

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
		createBooking(input: CreateBookingInput) {
			return request<BookingResponse>(
				getClientBookingsUrl(options.apiBaseUrl),
				{
					body: input,
					method: "POST",
				},
			);
		},
		listAvailability(expertId: string) {
			return request<AvailabilityListResponse>(
				getExpertAvailabilityUrl(options.apiBaseUrl, expertId),
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
	};
}
