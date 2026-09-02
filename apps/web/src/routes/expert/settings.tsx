import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { SettingsWorkspace } from "@/components/settings-workspace";

export const Route = createFileRoute("/expert/settings")({
	component: ExpertSettingsRoute,
	head: () => ({ meta: [{ title: "Expert Settings | Laxiriir Expert" }] }),
});

function ExpertSettingsRoute() {
	return (
		<ProtectedPage requireApprovedExpert roles={["expert"]}>
			<PageShell>
				<SettingsWorkspace />
			</PageShell>
		</ProtectedPage>
	);
}
