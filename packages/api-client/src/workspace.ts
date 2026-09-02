import type {
	ConversationListResponse,
	ConversationResponse,
	CreateSupportCaseInput,
	MarkConversationReadResponse,
	MessageResponse,
	SendMessageInput,
	SupportCaseListResponse,
	SupportCaseResponse,
	UpdateSupportCaseInput,
	WorkspacePreferences,
	WorkspacePreferencesResponse,
} from "@repo/contracts/workspace";

import { type ApiClientOptions, createApiRequest } from "./request";

export const MESSAGES_PATH = "/api/v1/messages";
export const SETTINGS_PATH = "/api/v1/settings";
export const SUPPORT_PATH = "/api/v1/support";
export const ADMIN_SUPPORT_PATH = "/api/v1/admin/support";

function conversationPath(bookingId: string) {
	return `${MESSAGES_PATH}/${encodeURIComponent(bookingId)}`;
}

export function createWorkspaceClient(options: ApiClientOptions) {
	const request = createApiRequest(options);
	return {
		createSupportCase(input: CreateSupportCaseInput) {
			return request<SupportCaseResponse>(SUPPORT_PATH, {
				body: input,
				method: "POST",
			});
		},
		getConversation(bookingId: string) {
			return request<ConversationResponse>(conversationPath(bookingId));
		},
		getPreferences() {
			return request<WorkspacePreferencesResponse>(SETTINGS_PATH);
		},
		listAdminSupportCases() {
			return request<SupportCaseListResponse>(ADMIN_SUPPORT_PATH);
		},
		listConversations() {
			return request<ConversationListResponse>(MESSAGES_PATH);
		},
		listSupportCases() {
			return request<SupportCaseListResponse>(SUPPORT_PATH);
		},
		markConversationRead(bookingId: string) {
			return request<MarkConversationReadResponse>(
				`${conversationPath(bookingId)}/read`,
				{ method: "PATCH" },
			);
		},
		sendMessage(bookingId: string, input: SendMessageInput) {
			return request<MessageResponse>(conversationPath(bookingId), {
				body: input,
				method: "POST",
			});
		},
		updateAdminSupportCase(id: string, input: UpdateSupportCaseInput) {
			return request<SupportCaseResponse>(
				`${ADMIN_SUPPORT_PATH}/${encodeURIComponent(id)}`,
				{ body: input, method: "PATCH" },
			);
		},
		updatePreferences(input: WorkspacePreferences) {
			return request<WorkspacePreferencesResponse>(SETTINGS_PATH, {
				body: input,
				method: "PATCH",
			});
		},
	};
}
