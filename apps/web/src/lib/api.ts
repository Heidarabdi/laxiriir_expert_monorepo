import { createAuthClient } from "@repo/api-client/auth";
import { createConsultationClient } from "@repo/api-client/consultations";
import { joinApiUrl } from "@repo/api-client/health";
import type { ApiRequestOptions } from "@repo/api-client/request";
import type {
	CurrentUserResponse,
	SignInInput,
	SignUpInput,
} from "@repo/contracts/auth";

export const API_BASE_URL = (
	import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8081"
).replace(/\/+$/, "");

export class ApiError extends Error {
	readonly status: number;

	constructor(message: string, status: number) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
}

async function fetchJson<TResponse>(
	url: string,
	options: ApiRequestOptions = {},
): Promise<TResponse> {
	const headers = new Headers(options.headers);
	let body: BodyInit | undefined;
	if (options.body !== undefined) {
		headers.set("content-type", "application/json");
		body = JSON.stringify(options.body);
	}

	const response = await fetch(url, {
		body,
		credentials: options.credentials ?? "include",
		headers,
		method: options.method ?? "GET",
	});

	if (!response.ok) {
		const payload = (await response.json().catch(() => null)) as {
			message?: string;
		} | null;
		throw new ApiError(
			payload?.message ?? "The request failed.",
			response.status,
		);
	}

	if (response.status === 204) return undefined as TResponse;
	return (await response.json()) as TResponse;
}

const clientOptions = {
	apiBaseUrl: API_BASE_URL,
	credentials: "include" as const,
	fetch: <TResponse>(url: string, options?: ApiRequestOptions) =>
		fetchJson<TResponse>(url, options),
};

export const accountApi = createAuthClient(clientOptions);
export const consultationApi = createConsultationClient(clientOptions);

async function authRequest<TResponse>(
	path: string,
	options: ApiRequestOptions,
): Promise<TResponse> {
	return fetchJson<TResponse>(
		joinApiUrl(API_BASE_URL, `/api/auth${path}`),
		options,
	);
}

export async function getCurrentUserOrNull() {
	try {
		return await accountApi.getCurrentUser();
	} catch (error) {
		if (error instanceof ApiError && error.status === 401) return null;
		throw error;
	}
}

export async function signIn(input: SignInInput) {
	await authRequest("/sign-in/email", { body: input, method: "POST" });
	return accountApi.getCurrentUser();
}

export async function signUp(input: SignUpInput) {
	await authRequest("/sign-up/email", { body: input, method: "POST" });
	return accountApi.getCurrentUser();
}

export function signOut() {
	return authRequest<void>("/sign-out", { method: "POST" });
}

export function resendVerificationEmail(email: string) {
	return authRequest<void>("/send-verification-email", {
		body: { email },
		method: "POST",
	});
}

export function requestPasswordReset(email: string) {
	return authRequest<void>("/request-password-reset", {
		body: { email },
		method: "POST",
	});
}

export function resetPassword(token: string, password: string) {
	return authRequest<void>("/reset-password", {
		body: { newPassword: password, token },
		method: "POST",
	});
}

export function verifyEmailToken(token: string) {
	const query = new URLSearchParams({ token });
	return authRequest<void>(`/verify-email?${query.toString()}`, {
		method: "GET",
	});
}

export type CurrentUser = CurrentUserResponse;
