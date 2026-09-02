import type {
	AdminBookingListResponse,
	AvailabilityInput,
	AvailabilityListResponse,
	AvailabilityResponse,
	BookingListResponse,
	BookingResponse,
	CreateBookingInput,
	ExpertBookingListResponse,
	ExpertBookingScope,
	ExpertDashboardSummary,
	ExpertListResponse,
	ExpertProfileInput,
	ExpertResponse,
} from "@repo/contracts/consultations";

import { type ApiClientOptions, createApiRequest } from "./request";

export const EXPERTS_PATH = "/api/v1/experts";
export const CLIENT_BOOKINGS_PATH = "/api/v1/client/bookings";
export const EXPERT_AVAILABILITY_PATH = "/api/v1/expert/availability";
export const EXPERT_BOOKINGS_PATH = "/api/v1/expert/bookings";
export const EXPERT_PROFILE_PATH = "/api/v1/expert/profile";

function expertAvailabilityPath(expertId: string) {
	return `${EXPERTS_PATH}/${encodeURIComponent(expertId)}/availability`;
}

function clientBookingPath(bookingId: string) {
	return `${CLIENT_BOOKINGS_PATH}/${encodeURIComponent(bookingId)}`;
}

function ownAvailabilityPath(slotId?: number) {
	return slotId === undefined
		? EXPERT_AVAILABILITY_PATH
		: `${EXPERT_AVAILABILITY_PATH}/${slotId}`;
}

export function createConsultationClient(options: ApiClientOptions) {
	const request = createApiRequest(options);

	return {
		cancelBooking(bookingId: string) {
			return request<BookingResponse>(clientBookingPath(bookingId), {
				method: "DELETE",
			});
		},
		createAvailability(input: AvailabilityInput) {
			return request<AvailabilityResponse>(ownAvailabilityPath(), {
				body: input,
				method: "POST",
			});
		},
		createBooking(input: CreateBookingInput) {
			return request<BookingResponse>(CLIENT_BOOKINGS_PATH, {
				body: input,
				method: "POST",
			});
		},
		deleteAvailability(slotId: number) {
			return request<void>(ownAvailabilityPath(slotId), { method: "DELETE" });
		},
		listAvailability(expertId: string) {
			return request<AvailabilityListResponse>(
				expertAvailabilityPath(expertId),
			);
		},
		listBookings() {
			return request<BookingListResponse>(CLIENT_BOOKINGS_PATH);
		},
		listExperts() {
			return request<ExpertListResponse>(EXPERTS_PATH);
		},
		listExpertBookings(scope: ExpertBookingScope) {
			return request<ExpertBookingListResponse>(
				`${EXPERT_BOOKINGS_PATH}?scope=${encodeURIComponent(scope)}`,
			);
		},
		getExpertDashboardSummary() {
			return request<ExpertDashboardSummary>(`${EXPERT_BOOKINGS_PATH}/summary`);
		},
		listAdminBookings() {
			return request<AdminBookingListResponse>("/api/v1/admin/bookings");
		},
		getExpertProfile() {
			return request<ExpertResponse>(EXPERT_PROFILE_PATH);
		},
		listOwnAvailability() {
			return request<AvailabilityListResponse>(ownAvailabilityPath());
		},
		rescheduleBooking(bookingId: string, input: CreateBookingInput) {
			return request<BookingResponse>(clientBookingPath(bookingId), {
				body: input,
				method: "PATCH",
			});
		},
		updateAvailability(slotId: number, input: AvailabilityInput) {
			return request<AvailabilityResponse>(ownAvailabilityPath(slotId), {
				body: input,
				method: "PATCH",
			});
		},
		updateExpertProfile(input: ExpertProfileInput) {
			return request<ExpertResponse>(EXPERT_PROFILE_PATH, {
				body: input,
				method: "PATCH",
			});
		},
	};
}
