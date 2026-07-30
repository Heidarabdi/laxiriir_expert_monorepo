import { isExpertApproved } from "~/lib/auth";

export default defineNuxtRouteMiddleware(async () => {
	if (import.meta.server) {
		return;
	}

	const auth = useAuthStore();
	await auth.ensureLoaded();

	if (!auth.user) {
		return navigateTo("/login");
	}

	if (!isExpertApproved(auth.user)) {
		return navigateTo("/expert/pending");
	}
});
