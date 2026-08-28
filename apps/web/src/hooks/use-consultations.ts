import type {
	AvailabilityInput,
	CreateBookingInput,
} from "@repo/contracts/consultations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { consultationApi } from "@/lib/api";

export const expertsQueryKey = ["consultations", "experts"] as const;
export const bookingsQueryKey = ["consultations", "client-bookings"] as const;
export const ownAvailabilityQueryKey = [
	"consultations",
	"expert-availability",
] as const;

export function useExperts() {
	return useQuery({
		queryFn: () => consultationApi.listExperts(),
		queryKey: expertsQueryKey,
	});
}

export function useExpertAvailability(expertId: string | null) {
	return useQuery({
		enabled: Boolean(expertId),
		queryFn: () => consultationApi.listAvailability(expertId as string),
		queryKey: ["consultations", "availability", expertId],
	});
}

export function useClientBookings() {
	return useQuery({
		queryFn: () => consultationApi.listBookings(),
		queryKey: bookingsQueryKey,
	});
}

export function useCreateBooking() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateBookingInput) =>
			consultationApi.createBooking(input),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: bookingsQueryKey }),
				queryClient.invalidateQueries({
					queryKey: ["consultations", "availability"],
				}),
			]);
		},
	});
}

export function useCancelBooking() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (bookingId: string) => consultationApi.cancelBooking(bookingId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: bookingsQueryKey });
		},
	});
}

export function useRescheduleBooking() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			bookingId,
			input,
		}: {
			bookingId: string;
			input: CreateBookingInput;
		}) => consultationApi.rescheduleBooking(bookingId, input),
		onSuccess: async () => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: bookingsQueryKey }),
				queryClient.invalidateQueries({
					queryKey: ["consultations", "availability"],
				}),
			]);
		},
	});
}

export function useOwnAvailability() {
	return useQuery({
		queryFn: () => consultationApi.listOwnAvailability(),
		queryKey: ownAvailabilityQueryKey,
	});
}

function useRefreshOwnAvailability() {
	const queryClient = useQueryClient();
	return () =>
		queryClient.invalidateQueries({ queryKey: ownAvailabilityQueryKey });
}

export function useCreateAvailability() {
	const refresh = useRefreshOwnAvailability();
	return useMutation({
		mutationFn: (input: AvailabilityInput) =>
			consultationApi.createAvailability(input),
		onSuccess: refresh,
	});
}

export function useUpdateAvailability() {
	const refresh = useRefreshOwnAvailability();
	return useMutation({
		mutationFn: ({
			slotId,
			input,
		}: {
			slotId: number;
			input: AvailabilityInput;
		}) => consultationApi.updateAvailability(slotId, input),
		onSuccess: refresh,
	});
}

export function useDeleteAvailability() {
	const refresh = useRefreshOwnAvailability();
	return useMutation({
		mutationFn: (slotId: number) => consultationApi.deleteAvailability(slotId),
		onSuccess: refresh,
	});
}
