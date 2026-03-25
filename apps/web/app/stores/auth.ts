import { defineStore } from "pinia";
import type { SignInInput, SignUpInput } from "@repo/platform/auth";
import type { CurrentUser, PrimaryRole } from "~/lib/auth";
import { getAuthRedirectPath } from "~/lib/auth";

export const useAuthStore = defineStore("auth", () => {
	const user = ref<CurrentUser | null>(null);
	const bootstrapped = ref(false);
	const loading = ref(false);
	const errorMessage = ref<string | null>(null);
	let bootstrapPromise: Promise<void> | null = null;

	const isAuthenticated = computed(() => user.value !== null);

	async function refreshCurrentUser(silent = false) {
		const authApi = useAuthApi();

		if (!silent) {
			loading.value = true;
			errorMessage.value = null;
		}

		try {
			user.value = await authApi.getCurrentUser();
		} catch {
			user.value = null;
		} finally {
			bootstrapped.value = true;
			loading.value = false;
		}
	}

	async function ensureLoaded() {
		if (bootstrapped.value) {
			return;
		}

		if (!bootstrapPromise) {
			bootstrapPromise = refreshCurrentUser(true).finally(() => {
				bootstrapPromise = null;
			});
		}

		await bootstrapPromise;
	}

	async function signIn(input: SignInInput) {
		const authApi = useAuthApi();

		loading.value = true;
		errorMessage.value = null;
		try {
			await authApi.signIn(input);
			await refreshCurrentUser(true);
			return user.value;
		} catch (error) {
			errorMessage.value = error instanceof Error ? error.message : "Unable to sign in.";
			throw error;
		} finally {
			loading.value = false;
		}
	}

	async function signUp(input: SignUpInput) {
		const authApi = useAuthApi();

		loading.value = true;
		errorMessage.value = null;
		try {
			await authApi.signUp(input);
			await authApi.resendVerificationEmail();
			await refreshCurrentUser(true);
			return user.value;
		} catch (error) {
			errorMessage.value = error instanceof Error ? error.message : "Unable to create account.";
			throw error;
		} finally {
			loading.value = false;
		}
	}

	async function resendVerificationEmail(email: string, role?: PrimaryRole) {
		void email;
		void role;
		const authApi = useAuthApi();
		await authApi.resendVerificationEmail();
	}

	async function requestPasswordReset(email: string) {
		const authApi = useAuthApi();
		await authApi.requestPasswordReset(email);
	}

	async function resetPassword(token: string, password: string) {
		const authApi = useAuthApi();
		await authApi.resetPassword(token, password);
	}

	async function verifyEmailToken(token: string) {
		const authApi = useAuthApi();
		await authApi.verifyEmailToken(token);
		await refreshCurrentUser(true);
	}

	async function signOut() {
		const authApi = useAuthApi();

		try {
			await authApi.signOut();
		} finally {
			user.value = null;
			bootstrapped.value = true;
		}
	}

	function getAuthenticatedPath() {
		if (!user.value) {
			return "/";
		}
		return getAuthRedirectPath(user.value);
	}

	return {
		bootstrapped,
		ensureLoaded,
		errorMessage,
		getAuthenticatedPath,
		isAuthenticated,
		loading,
		refreshCurrentUser,
		requestPasswordReset,
		resendVerificationEmail,
		resetPassword,
		signIn,
		signOut,
		signUp,
		user,
		verifyEmailToken,
	};
});
