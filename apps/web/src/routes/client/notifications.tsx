import { createFileRoute } from "@tanstack/react-router";

import { NotificationsWorkspace } from "@/components/notifications-workspace";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";

export const Route = createFileRoute("/client/notifications")({
	component: NotificationsRoute,
	head: () => ({ meta: [{ title: "Notifications | Laxiriir Expert" }] }),
});

function NotificationsRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<NotificationsWorkspace description="Booking activity and important account updates stay together here." />
			</PageShell>
		</ProtectedPage>
	);
}
