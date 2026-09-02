import type {
	MarkAllNotificationsReadResponse,
	NotificationListResponse,
	NotificationResponse,
	SavedExpertListResponse,
	SavedExpertResponse,
} from "@repo/contracts/engagements";

import { type ApiClientOptions, createApiRequest } from "./request";

export const SAVED_EXPERTS_PATH = "/api/v1/client/saved-experts";
export const NOTIFICATIONS_PATH = "/api/v1/notifications";

function savedExpertPath(expertId: string) {
	return `${SAVED_EXPERTS_PATH}/${encodeURIComponent(expertId)}`;
}

function notificationPath(notificationId: string) {
	return `${NOTIFICATIONS_PATH}/${encodeURIComponent(notificationId)}`;
}

export function createEngagementClient(options: ApiClientOptions) {
	const request = createApiRequest(options);

	return {
		listNotifications() {
			return request<NotificationListResponse>(NOTIFICATIONS_PATH);
		},
		listSavedExperts() {
			return request<SavedExpertListResponse>(SAVED_EXPERTS_PATH);
		},
		markAllNotificationsRead() {
			return request<MarkAllNotificationsReadResponse>(
				`${NOTIFICATIONS_PATH}/read-all`,
				{ method: "PATCH" },
			);
		},
		markNotificationRead(notificationId: string) {
			return request<NotificationResponse>(notificationPath(notificationId), {
				method: "PATCH",
			});
		},
		removeSavedExpert(expertId: string) {
			return request<void>(savedExpertPath(expertId), { method: "DELETE" });
		},
		saveExpert(expertId: string) {
			return request<SavedExpertResponse>(savedExpertPath(expertId), {
				method: "PUT",
			});
		},
	};
}
