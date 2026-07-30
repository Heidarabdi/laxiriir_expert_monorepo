export default defineNuxtRouteMiddleware(async (to) => {
	if (to.path !== "/bookings" && to.path !== "/client") {
		return;
	}
	if (import.meta.server) {
		return;
	}

	const auth = useAuthStore();
	await auth.ensureLoaded();

	if (!auth.user) {
		return navigateTo("/login");
	}
	if (!auth.user.emailVerified) {
		return navigateTo("/verify-email");
	}
	if (auth.user.primaryRole !== "client") {
		return navigateTo(auth.getAuthenticatedPath());
	}
});
