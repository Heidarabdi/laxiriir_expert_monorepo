import { joinApiUrl } from "./health";

export const primaryRoles = ["client", "expert", "admin"] as const;

export type PrimaryRole = (typeof primaryRoles)[number];

export const publicRegistrationRoles = ["client", "expert"] as const;

export type PublicRegistrationRole = (typeof publicRegistrationRoles)[number];

export const expertStatuses = [
	"not_applicable",
	"pending_review",
	"approved",
	"rejected",
	"suspended",
] as const;

export type ExpertStatus = (typeof expertStatuses)[number];

export const allowedAreas = ["client", "expert", "expert_pending", "admin"] as const;

export type AllowedArea = (typeof allowedAreas)[number];

export const expertStatusActions = ["approve", "reject", "suspend"] as const;

export type ExpertStatusAction = (typeof expertStatusActions)[number];

export const CURRENT_USER_PATH = "/api/v1/me";

export interface AccountProfileSummary {
	createdAt: string;
	displayName: string;
	email: string;
	expertStatus: ExpertStatus;
	identityUserId: string;
	primaryRole: PrimaryRole;
	updatedAt: string;
}

export interface CurrentUserResponse {
	allowedAreas: AllowedArea[];
	displayName: string;
	email: string;
	emailVerified: boolean;
	expertStatus: ExpertStatus;
	primaryRole: PrimaryRole;
	userId: string;
}

export interface ExpertStatusUpdateResponse {
	message: string;
	profile: AccountProfileSummary;
}

export interface SignInInput {
	email: string;
	password: string;
}

export interface SignUpInput {
	email: string;
	name: string;
	password: string;
	role: PublicRegistrationRole;
}

export type PlatformRequestMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export type PlatformRequestCredentials = "include" | "omit" | "same-origin";

export type PlatformRequestHeaders = Record<string, string>;

export interface PlatformRequestOptions {
	body?: unknown;
	credentials?: PlatformRequestCredentials;
	headers?: PlatformRequestHeaders;
	method?: PlatformRequestMethod;
}

export type PlatformFetch = <TResponse>(
	url: string,
	options?: PlatformRequestOptions,
) => Promise<TResponse>;

export interface PlatformAuthClientOptions {
	apiBaseUrl: string;
	credentials?: PlatformRequestCredentials;
	fetch: PlatformFetch;
	headers?: PlatformRequestHeaders;
}

function mergeHeaders(
	baseHeaders: PlatformRequestHeaders | undefined,
	extraHeaders: PlatformRequestHeaders | undefined,
) {
	return {
		...(baseHeaders ?? {}),
		...(extraHeaders ?? {}),
	};
}

function createRequestOptions(
	defaultCredentials: PlatformRequestCredentials | undefined,
	defaultHeaders: PlatformRequestHeaders | undefined,
	options: PlatformRequestOptions | undefined,
): PlatformRequestOptions {
	return {
		...options,
		credentials: options?.credentials ?? defaultCredentials,
		headers: mergeHeaders(defaultHeaders, options?.headers),
	};
}

export function getCurrentUserUrl(apiBaseUrl: string) {
	return joinApiUrl(apiBaseUrl, CURRENT_USER_PATH);
}

export function getExpertStatusActionUrl(
	apiBaseUrl: string,
	identityUserId: string,
	action: ExpertStatusAction,
) {
	return joinApiUrl(
		apiBaseUrl,
		`/api/v1/admin/experts/${encodeURIComponent(identityUserId)}/${action}`,
	);
}

export function createPlatformAuthClient(options: PlatformAuthClientOptions) {
	const baseRequest = <TResponse>(
		url: string,
		requestOptions?: PlatformRequestOptions,
	) =>
		options.fetch<TResponse>(
			url,
			createRequestOptions(options.credentials, options.headers, requestOptions),
		);

	return {
		approveExpert(identityUserId: string) {
			return baseRequest<ExpertStatusUpdateResponse>(
				getExpertStatusActionUrl(options.apiBaseUrl, identityUserId, "approve"),
				{ method: "PATCH" },
			);
		},
		getCurrentUser() {
			return baseRequest<CurrentUserResponse>(getCurrentUserUrl(options.apiBaseUrl));
		},
		rejectExpert(identityUserId: string) {
			return baseRequest<ExpertStatusUpdateResponse>(
				getExpertStatusActionUrl(options.apiBaseUrl, identityUserId, "reject"),
				{ method: "PATCH" },
			);
		},
		suspendExpert(identityUserId: string) {
			return baseRequest<ExpertStatusUpdateResponse>(
				getExpertStatusActionUrl(options.apiBaseUrl, identityUserId, "suspend"),
				{ method: "PATCH" },
			);
		},
	};
}
