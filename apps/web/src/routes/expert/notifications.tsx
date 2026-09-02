import { createFileRoute } from "@tanstack/react-router";

import { NotificationsWorkspace } from "@/components/notifications-workspace";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";

export const Route = createFileRoute("/expert/notifications")({
	component: ExpertNotificationsRoute,
	head: () => ({
		meta: [{ title: "Expert Notifications | Laxiriir Expert" }],
	}),
});

function ExpertNotificationsRoute() {
	return (
		<ProtectedPage requireApprovedExpert roles={["expert"]}>
			<PageShell>
				<NotificationsWorkspace description="New bookings and client schedule changes appear here as they happen." />
			</PageShell>
		</ProtectedPage>
	);
}
