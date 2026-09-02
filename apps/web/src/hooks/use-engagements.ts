import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { engagementApi } from "@/lib/api";

export const savedExpertsQueryKey = ["engagements", "saved-experts"] as const;
export const notificationsQueryKey = ["engagements", "notifications"] as const;

export function useSavedExperts(enabled = true) {
	return useQuery({
		enabled,
		queryFn: () => engagementApi.listSavedExperts(),
		queryKey: savedExpertsQueryKey,
	});
}

export function useSaveExpert() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (expertId: string) => engagementApi.saveExpert(expertId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: savedExpertsQueryKey });
		},
	});
}

export function useRemoveSavedExpert() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (expertId: string) => engagementApi.removeSavedExpert(expertId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: savedExpertsQueryKey });
		},
	});
}

export function useNotifications() {
	return useQuery({
		queryFn: () => engagementApi.listNotifications(),
		queryKey: notificationsQueryKey,
	});
}

export function useMarkNotificationRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (notificationId: string) =>
			engagementApi.markNotificationRead(notificationId),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
		},
	});
}

export function useMarkAllNotificationsRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: () => engagementApi.markAllNotificationsRead(),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
		},
	});
}
