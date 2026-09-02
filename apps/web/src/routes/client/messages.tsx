import { createFileRoute } from "@tanstack/react-router";
import { MessagingWorkspace } from "@/components/messaging-workspace";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";

export const Route = createFileRoute("/client/messages")({
	component: ClientMessagesRoute,
	head: () => ({ meta: [{ title: "Messages | Laxiriir Expert" }] }),
});

function ClientMessagesRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<MessagingWorkspace description="Keep every expert conversation connected to its consultation." />
			</PageShell>
		</ProtectedPage>
	);
}
