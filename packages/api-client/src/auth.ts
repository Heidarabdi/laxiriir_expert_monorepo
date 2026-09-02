import type {
	AccountProfileInput,
	AdminExpertListResponse,
	AdminUserListResponse,
	CurrentUserResponse,
	ExpertStatusAction,
	ExpertStatusUpdateResponse,
} from "@repo/contracts/auth";

import { type ApiClientOptions, createApiRequest } from "./request";

export const CURRENT_USER_PATH = "/api/v1/me";

function expertStatusActionPath(
	identityUserId: string,
	action: ExpertStatusAction,
) {
	return `/api/v1/admin/experts/${encodeURIComponent(identityUserId)}/${action}`;
}

export function createAuthClient(options: ApiClientOptions) {
	const request = createApiRequest(options);
	const updateExpertStatus = (
		identityUserId: string,
		action: ExpertStatusAction,
	) =>
		request<ExpertStatusUpdateResponse>(
			expertStatusActionPath(identityUserId, action),
			{ method: "PATCH" },
		);

	return {
		listAdminExperts() {
			return request<AdminExpertListResponse>("/api/v1/admin/experts");
		},
		listAdminUsers() {
			return request<AdminUserListResponse>("/api/v1/admin/users");
		},
		approveExpert(identityUserId: string) {
			return updateExpertStatus(identityUserId, "approve");
		},
		getCurrentUser() {
			return request<CurrentUserResponse>(CURRENT_USER_PATH);
		},
		updateCurrentUser(input: AccountProfileInput) {
			return request<CurrentUserResponse>(CURRENT_USER_PATH, {
				body: input,
				method: "PATCH",
			});
		},
		rejectExpert(identityUserId: string) {
			return updateExpertStatus(identityUserId, "reject");
		},
		suspendExpert(identityUserId: string) {
			return updateExpertStatus(identityUserId, "suspend");
		},
	};
}
