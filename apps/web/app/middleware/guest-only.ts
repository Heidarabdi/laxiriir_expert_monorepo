import { getAuthRedirectPath } from "~/lib/auth";

export default defineNuxtRouteMiddleware(async () => {
	const auth = useAuthStore();
	await auth.ensureLoaded();

	if (!auth.user) {
		return;
	}

	return navigateTo(getAuthRedirectPath(auth.user));
});
