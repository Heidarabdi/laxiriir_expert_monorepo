import {
	createPlatformAuthClient,
	type PlatformRequestOptions,
	type SignInInput,
	type SignUpInput,
} from "@repo/platform/auth";
import { joinApiUrl } from "@repo/platform/health";
import type { CurrentUser } from "~/lib/auth";

function ensureClientAuthRuntime() {
	if (!import.meta.client) {
		throw new Error("This auth action is only available in the browser.");
	}
}

function getErrorMessage(error: unknown, fallback: string) {
	if (error && typeof error === "object" && "data" in error) {
		const data = error.data;
		if (data && typeof data === "object" && "message" in data) {
			const message = data.message;
			if (typeof message === "string" && message.trim()) return message;
		}
	}
	return error instanceof Error && error.message ? error.message : fallback;
}

export function useAuthApi() {
	const config = useRuntimeConfig();
	const fetchJson = $fetch as unknown as (
		url: string,
		options?: PlatformRequestOptions,
	) => Promise<unknown>;
	const authClient = createPlatformAuthClient({
		apiBaseUrl: config.public.apiBaseUrl,
		credentials: "include",
		fetch: <TResponse>(url: string, options?: PlatformRequestOptions) =>
			fetchJson(url, options) as Promise<TResponse>,
	});

	async function authRequest<TResponse>(
		path: string,
		options: PlatformRequestOptions,
		fallback: string,
	) {
		ensureClientAuthRuntime();
		try {
			return (await fetchJson(
				joinApiUrl(config.public.apiBaseUrl, `/api/auth${path}`),
				{ ...options, credentials: "include" },
			)) as TResponse;
		} catch (error) {
			throw new Error(getErrorMessage(error, fallback));
		}
	}

	function getCurrentUser() {
		return authClient.getCurrentUser() as Promise<CurrentUser>;
	}

	function signIn(input: SignInInput) {
		return authRequest(
			"/sign-in/email",
			{ body: input, method: "POST" },
			"Unable to sign in.",
		);
	}

	function signUp(input: SignUpInput) {
		return authRequest(
			"/sign-up/email",
			{ body: input, method: "POST" },
			"Unable to create account.",
		);
	}

	function resendVerificationEmail(email: string) {
		return authRequest(
			"/send-verification-email",
			{ body: { email }, method: "POST" },
			"Unable to send the verification email.",
		);
	}

	function requestPasswordReset(email: string) {
		return authRequest(
			"/request-password-reset",
			{ body: { email }, method: "POST" },
			"Unable to send the password reset email.",
		);
	}

	function resetPassword(token: string, password: string) {
		return authRequest(
			"/reset-password",
			{ body: { newPassword: password, token }, method: "POST" },
			"This reset link is invalid or has expired.",
		);
	}

	function signOut() {
		return authRequest(
			"/sign-out",
			{ method: "POST" },
			"Unable to sign out.",
		);
	}

	function verifyEmailToken(token: string) {
		const query = new URLSearchParams({ token });
		return authRequest(
			`/verify-email?${query.toString()}`,
			{ method: "GET" },
			"This verification link is invalid or has expired.",
		);
	}

	return {
		getCurrentUser,
		requestPasswordReset,
		resendVerificationEmail,
		resetPassword,
		signIn,
		signOut,
		signUp,
		verifyEmailToken,
	};
}
