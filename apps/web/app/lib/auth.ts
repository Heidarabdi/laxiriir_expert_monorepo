import type {
	CurrentUserResponse,
	ExpertStatus,
	PublicRegistrationRole,
	PrimaryRole,
} from "@repo/platform/auth";

export type { ExpertStatus, PrimaryRole, PublicRegistrationRole };
export type CurrentUser = CurrentUserResponse;

export function getRoleHomePath(user: CurrentUser) {
	switch (user.primaryRole) {
		case "admin":
			return "/admin";
		case "expert":
			return user.expertStatus === "approved" ? "/expert" : "/expert/pending";
		default:
			return "/client";
	}
}

export function getAuthRedirectPath(user: CurrentUser) {
	if (!user.emailVerified) {
		return "/verify-email";
	}

	return getRoleHomePath(user);
}

export function isRoleAllowed(user: CurrentUser, roles: PrimaryRole[]) {
	return roles.includes(user.primaryRole);
}

export function isExpertApproved(user: CurrentUser) {
	return user.primaryRole === "expert" && user.expertStatus === "approved";
}

export function getAppBaseUrl() {
	if (import.meta.client) {
		return window.location.origin;
	}

	return useRequestURL().origin;
}
