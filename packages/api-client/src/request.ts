import { joinApiUrl } from "./health";

export type ApiRequestMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";
export type ApiRequestCredentials = "include" | "omit" | "same-origin";
export type ApiRequestHeaders = Record<string, string>;

export interface ApiRequestOptions {
	body?: unknown;
	credentials?: ApiRequestCredentials;
	headers?: ApiRequestHeaders;
	method?: ApiRequestMethod;
}

export type ApiFetch = <TResponse>(
	url: string,
	options?: ApiRequestOptions,
) => Promise<TResponse>;

export interface ApiClientOptions {
	apiBaseUrl: string;
	credentials?: ApiRequestCredentials;
	fetch: ApiFetch;
	headers?: ApiRequestHeaders;
}

function mergeHeaders(
	baseHeaders: ApiRequestHeaders | undefined,
	extraHeaders: ApiRequestHeaders | undefined,
) {
	if (!baseHeaders && !extraHeaders) return undefined;

	return {
		...(baseHeaders ?? {}),
		...(extraHeaders ?? {}),
	};
}

export function createApiRequest(options: ApiClientOptions) {
	return <TResponse>(path: string, requestOptions?: ApiRequestOptions) => {
		const headers = mergeHeaders(options.headers, requestOptions?.headers);

		return options.fetch<TResponse>(joinApiUrl(options.apiBaseUrl, path), {
			...requestOptions,
			credentials:
				requestOptions?.credentials ?? options.credentials ?? "include",
			...(headers ? { headers } : {}),
		});
	};
}
