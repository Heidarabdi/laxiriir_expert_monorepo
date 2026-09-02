import type {
	CreateSupportCaseInput,
	SendMessageInput,
	UpdateSupportCaseInput,
	WorkspacePreferences,
} from "@repo/contracts/workspace";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { workspaceApi } from "@/lib/api";

export const conversationsQueryKey = ["workspace", "conversations"] as const;
export const preferencesQueryKey = ["workspace", "preferences"] as const;
export const supportCasesQueryKey = ["workspace", "support"] as const;
export const adminSupportCasesQueryKey = [
	"workspace",
	"admin-support",
] as const;

export function useConversations() {
	return useQuery({
		queryFn: () => workspaceApi.listConversations(),
		queryKey: conversationsQueryKey,
	});
}

export function useConversation(bookingId: string | null) {
	return useQuery({
		enabled: Boolean(bookingId),
		queryFn: () => workspaceApi.getConversation(bookingId ?? ""),
		queryKey: [...conversationsQueryKey, bookingId],
	});
}

export function useSendMessage() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: { bookingId: string; message: SendMessageInput }) =>
			workspaceApi.sendMessage(input.bookingId, input.message),
		onSuccess: async (_response, input) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: conversationsQueryKey }),
				queryClient.invalidateQueries({
					queryKey: [...conversationsQueryKey, input.bookingId],
				}),
			]);
		},
	});
}

export function useMarkConversationRead() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (bookingId: string) =>
			workspaceApi.markConversationRead(bookingId),
		onSuccess: async (_response, bookingId) => {
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: conversationsQueryKey }),
				queryClient.invalidateQueries({
					queryKey: [...conversationsQueryKey, bookingId],
				}),
			]);
		},
	});
}

export function usePreferences() {
	return useQuery({
		queryFn: () => workspaceApi.getPreferences(),
		queryKey: preferencesQueryKey,
	});
}

export function useUpdatePreferences() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: WorkspacePreferences) =>
			workspaceApi.updatePreferences(input),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: preferencesQueryKey });
		},
	});
}

export function useSupportCases() {
	return useQuery({
		queryFn: () => workspaceApi.listSupportCases(),
		queryKey: supportCasesQueryKey,
	});
}

export function useCreateSupportCase() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: CreateSupportCaseInput) =>
			workspaceApi.createSupportCase(input),
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: supportCasesQueryKey });
		},
	});
}

export function useAdminSupportCases() {
	return useQuery({
		queryFn: () => workspaceApi.listAdminSupportCases(),
		queryKey: adminSupportCasesQueryKey,
	});
}

export function useUpdateAdminSupportCase() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: { id: string; update: UpdateSupportCaseInput }) =>
			workspaceApi.updateAdminSupportCase(input.id, input.update),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: adminSupportCasesQueryKey,
			});
		},
	});
}
