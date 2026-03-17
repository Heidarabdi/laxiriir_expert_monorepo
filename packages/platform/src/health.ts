export interface HealthResponse {
	status: string;
	env: string;
}

export interface PingResponse {
	message: string;
}

export const HEALTH_PATH = "/health";
export const API_V1_PING_PATH = "/api/v1/ping";

export function joinApiUrl(baseUrl: string, path: string) {
	const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
	const normalizedPath = path.startsWith("/") ? path : `/${path}`;

	return `${normalizedBaseUrl}${normalizedPath}`;
}

export function getHealthUrl(baseUrl: string) {
	return joinApiUrl(baseUrl, HEALTH_PATH);
}

export function getPingUrl(baseUrl: string) {
	return joinApiUrl(baseUrl, API_V1_PING_PATH);
}
