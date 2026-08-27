import { getHealthUrl, normalizeApiBaseUrl } from "@repo/api-client/health";

export function getWebHealthUrl(apiBaseUrl: string) {
	return getHealthUrl(apiBaseUrl);
}

export { normalizeApiBaseUrl };
