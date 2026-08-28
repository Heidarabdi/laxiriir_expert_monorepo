import type { CurrentUserResponse, PrimaryRole } from "@repo/contracts/auth";

export function getRoleHomePath(user: CurrentUserResponse) {
	switch (user.primaryRole) {
		case "admin":
			return "/admin" as const;
		case "expert":
			return user.expertStatus === "approved"
				? ("/expert" as const)
				: ("/expert/pending" as const);
		default:
			return "/client" as const;
	}
}

export function getAuthRedirectPath(user: CurrentUserResponse) {
	return user.emailVerified
		? getRoleHomePath(user)
		: ("/verify-email" as const);
}

export function userHasRole(user: CurrentUserResponse, roles: PrimaryRole[]) {
	return roles.includes(user.primaryRole);
}
