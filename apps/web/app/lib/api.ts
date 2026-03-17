import { getHealthUrl } from "@repo/platform/health";

export function getWebHealthUrl(apiBaseUrl: string) {
	return getHealthUrl(apiBaseUrl);
}
