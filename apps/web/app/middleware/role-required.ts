import { isRoleAllowed, type PrimaryRole } from "~/lib/auth";

export default defineNuxtRouteMiddleware(async (to) => {
	const auth = useAuthStore();
	await auth.ensureLoaded();

	if (!auth.user) {
		return navigateTo("/login");
	}

	const roles = (to.meta.roles as PrimaryRole[] | undefined) ?? [];
	if (roles.length > 0 && !isRoleAllowed(auth.user, roles)) {
		return navigateTo(auth.getAuthenticatedPath());
	}
});
