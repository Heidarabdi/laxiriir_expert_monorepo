import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { SettingsWorkspace } from "@/components/settings-workspace";

export const Route = createFileRoute("/admin/settings")({
	component: AdminSettingsRoute,
	head: () => ({ meta: [{ title: "Admin Settings | Laxiriir Expert" }] }),
});

function AdminSettingsRoute() {
	return <ProtectedPage roles={["admin"]}><PageShell><SettingsWorkspace /></PageShell></ProtectedPage>;
}
