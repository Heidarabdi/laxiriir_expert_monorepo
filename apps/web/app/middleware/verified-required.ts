export default defineNuxtRouteMiddleware(async () => {
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
});
