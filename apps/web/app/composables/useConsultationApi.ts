import { createConsultationClient } from "@repo/api-client/consultations";
import type {
	ApiClientOptions,
	ApiRequestOptions,
} from "@repo/api-client/request";

export function useConsultationApi() {
	const config = useRuntimeConfig();
	const fetchJson = $fetch as unknown as (
		url: string,
		options?: ApiRequestOptions,
	) => Promise<unknown>;
	const options: ApiClientOptions = {
		apiBaseUrl: config.public.apiBaseUrl,
		credentials: "include",
		fetch: <TResponse>(url: string, requestOptions?: ApiRequestOptions) =>
			fetchJson(url, requestOptions) as Promise<TResponse>,
	};

	return createConsultationClient(options);
}
