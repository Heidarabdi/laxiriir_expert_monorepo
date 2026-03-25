export default defineNuxtRouteMiddleware(async (to) => {
	const auth = useAuthStore();
	await auth.ensureLoaded();

	if (to.path === "/bookings") {
		if (!auth.user) {
			return navigateTo("/login");
		}
		if (!auth.user.emailVerified) {
			return navigateTo("/verify-email");
		}
		if (auth.user.primaryRole !== "client") {
			return navigateTo(auth.getAuthenticatedPath());
		}
	}
});
