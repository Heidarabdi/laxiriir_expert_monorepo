import { createFileRoute } from "@tanstack/react-router";
import { NotificationsWorkspace } from "@/components/notifications-workspace";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";

export const Route = createFileRoute("/admin/notifications")({
	component: AdminNotificationsRoute,
	head: () => ({ meta: [{ title: "Admin Notifications | Laxiriir Expert" }] }),
});

function AdminNotificationsRoute() {
	return <ProtectedPage roles={["admin"]}><PageShell><NotificationsWorkspace description="Review account and operations activity that needs administrator attention." /></PageShell></ProtectedPage>;
}
