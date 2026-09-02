import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { SettingsWorkspace } from "@/components/settings-workspace";

export const Route = createFileRoute("/client/settings")({
	component: ClientSettingsRoute,
	head: () => ({ meta: [{ title: "Settings | Laxiriir Expert" }] }),
});

function ClientSettingsRoute() {
	return <ProtectedPage roles={["client"]}><PageShell><SettingsWorkspace /></PageShell></ProtectedPage>;
}
