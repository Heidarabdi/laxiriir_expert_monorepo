import {
	createPlatformConsultationClient,
	type PlatformConsultationClientOptions,
} from "@repo/platform/consultations";
import type { PlatformRequestOptions } from "@repo/platform/auth";

export function useConsultationApi() {
	const config = useRuntimeConfig();
	const fetchJson = $fetch as unknown as (
		url: string,
		options?: PlatformRequestOptions,
	) => Promise<unknown>;
	const options: PlatformConsultationClientOptions = {
		apiBaseUrl: config.public.apiBaseUrl,
		credentials: "include",
		fetch: <TResponse>(url: string, requestOptions?: PlatformRequestOptions) =>
			fetchJson(url, requestOptions) as Promise<TResponse>,
	};

	return createPlatformConsultationClient(options);
}
