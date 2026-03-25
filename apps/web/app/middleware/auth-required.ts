export default defineNuxtRouteMiddleware(async () => {
	const auth = useAuthStore();
	await auth.ensureLoaded();

	if (!auth.user) {
		return navigateTo("/login");
	}
});
