import type {
	AccountProfileInput,
	ExpertStatusAction,
	SignInInput,
	SignUpInput,
} from "@repo/contracts/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
	accountApi,
	getCurrentUserOrNull,
	signIn,
	signOut,
	signUp,
} from "@/lib/api";

export const currentUserQueryKey = ["auth", "current-user"] as const;
export const adminExpertsQueryKey = ["auth", "admin-experts"] as const;
export const adminUsersQueryKey = ["auth", "admin-users"] as const;

export function useAdminExperts() {
	return useQuery({
		queryFn: () => accountApi.listAdminExperts(),
		queryKey: adminExpertsQueryKey,
	});
}

export function useAdminUsers() {
	return useQuery({
		queryFn: () => accountApi.listAdminUsers(),
		queryKey: adminUsersQueryKey,
	});
}

export function useModerateExpert() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			action,
			expertId,
		}: {
			action: ExpertStatusAction;
			expertId: string;
		}) => {
			switch (action) {
				case "approve":
					return accountApi.approveExpert(expertId);
				case "reject":
					return accountApi.rejectExpert(expertId);
				case "suspend":
					return accountApi.suspendExpert(expertId);
			}
		},
		onSuccess: () =>
			queryClient.invalidateQueries({ queryKey: adminExpertsQueryKey }),
	});
}

export function useCurrentUser() {
	return useQuery({
		queryFn: getCurrentUserOrNull,
		queryKey: currentUserQueryKey,
		retry: false,
	});
}

export function useUpdateCurrentUser() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: AccountProfileInput) =>
			accountApi.updateCurrentUser(input),
		onSuccess: (user) => queryClient.setQueryData(currentUserQueryKey, user),
	});
}

export function useSignIn() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: SignInInput) => signIn(input),
		onSuccess: (user) => queryClient.setQueryData(currentUserQueryKey, user),
	});
}

export function useSignUp() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (input: SignUpInput) => signUp(input),
		onSuccess: (user) => queryClient.setQueryData(currentUserQueryKey, user),
	});
}

export function useSignOut() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: signOut,
		onSettled: () => queryClient.setQueryData(currentUserQueryKey, null),
	});
}
