import {
	createPlatformAuthClient,
	type PlatformRequestOptions,
	type SignInInput,
	type SignUpInput,
} from "@repo/platform/auth";
import type { CurrentUser } from "~/lib/auth";

function formatFieldErrorMessage(
	fields: Array<{ error: string; id: string }> | undefined,
	fallback: string,
) {
	const first = fields?.find((field) => field.error?.trim().length > 0);
	return first?.error ?? fallback;
}

function ensureClientAuthRuntime() {
	if (import.meta.client) {
		return;
	}

	throw new Error("This auth action is only available in the browser.");
}

function replaceQueryToken(token: string) {
	if (!import.meta.client || token.trim() === "") {
		return;
	}

	const url = new URL(window.location.href);
	url.searchParams.set("token", token);
	window.history.replaceState({}, "", url.toString());
}

export function useAuthApi() {
	const config = useRuntimeConfig();
	const authClient = createPlatformAuthClient({
		apiBaseUrl: config.public.apiBaseUrl,
		credentials: "include",
		fetch: <TResponse>(url: string, options?: PlatformRequestOptions) =>
			$fetch<TResponse>(url, {
				body: options?.body,
				credentials: options?.credentials,
				headers: options?.headers,
				method: options?.method,
			}),
	});

	async function getCurrentUser() {
		return authClient.getCurrentUser() as Promise<CurrentUser>;
	}

	async function signIn(input: SignInInput) {
		ensureClientAuthRuntime();

		const { signIn: signInWithEmailPassword } = await import(
			"supertokens-web-js/recipe/emailpassword"
		);

		const response = await signInWithEmailPassword({
			formFields: [
				{ id: "email", value: input.email },
				{ id: "password", value: input.password },
			],
		});

		switch (response.status) {
			case "OK":
				return response.user;
			case "WRONG_CREDENTIALS_ERROR":
				throw new Error("The email or password you entered is incorrect.");
			case "FIELD_ERROR":
				throw new Error(
					formatFieldErrorMessage(response.formFields, "Please check your sign-in details."),
				);
			case "SIGN_IN_NOT_ALLOWED":
				throw new Error(response.reason);
		}
	}

	async function signUp(input: SignUpInput) {
		ensureClientAuthRuntime();

		const { signUp: signUpWithEmailPassword } = await import(
			"supertokens-web-js/recipe/emailpassword"
		);

		const response = await signUpWithEmailPassword({
			formFields: [
				{ id: "email", value: input.email },
				{ id: "password", value: input.password },
				{ id: "name", value: input.name },
				{ id: "role", value: input.role },
			],
		});

		switch (response.status) {
			case "OK":
				return response.user;
			case "FIELD_ERROR":
				throw new Error(
					formatFieldErrorMessage(
						response.formFields,
						"Please check the account details you entered.",
					),
				);
			case "SIGN_UP_NOT_ALLOWED":
				throw new Error(response.reason);
		}
	}

	async function resendVerificationEmail() {
		ensureClientAuthRuntime();

		const { sendVerificationEmail } = await import(
			"supertokens-web-js/recipe/emailverification"
		);
		const response = await sendVerificationEmail();

		if (response.status === "EMAIL_ALREADY_VERIFIED_ERROR") {
			return;
		}
	}

	async function requestPasswordReset(email: string) {
		ensureClientAuthRuntime();

		const { sendPasswordResetEmail } = await import(
			"supertokens-web-js/recipe/emailpassword"
		);
		const response = await sendPasswordResetEmail({
			formFields: [{ id: "email", value: email }],
		});

		switch (response.status) {
			case "OK":
				return;
			case "FIELD_ERROR":
				throw new Error(
					formatFieldErrorMessage(
						response.formFields,
						"Please enter a valid email address.",
					),
				);
			case "PASSWORD_RESET_NOT_ALLOWED":
				throw new Error(response.reason);
		}
	}

	async function resetPassword(token: string, password: string) {
		ensureClientAuthRuntime();
		replaceQueryToken(token);

		const { submitNewPassword } = await import(
			"supertokens-web-js/recipe/emailpassword"
		);
		const response = await submitNewPassword({
			formFields: [{ id: "password", value: password }],
		});

		switch (response.status) {
			case "OK":
				return;
			case "RESET_PASSWORD_INVALID_TOKEN_ERROR":
				throw new Error("This reset link is invalid or has expired.");
			case "FIELD_ERROR":
				throw new Error(
					formatFieldErrorMessage(
						response.formFields,
						"Please choose a stronger password.",
					),
				);
		}
	}

	async function signOut() {
		ensureClientAuthRuntime();

		const { signOut: signOutSession } = await import(
			"supertokens-web-js/recipe/session"
		);
		await signOutSession();
	}

	async function verifyEmailToken(token: string) {
		ensureClientAuthRuntime();
		replaceQueryToken(token);

		const { verifyEmail } = await import(
			"supertokens-web-js/recipe/emailverification"
		);
		const response = await verifyEmail();

		if (response.status === "EMAIL_VERIFICATION_INVALID_TOKEN_ERROR") {
			throw new Error("This verification link is invalid or has expired.");
		}
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
