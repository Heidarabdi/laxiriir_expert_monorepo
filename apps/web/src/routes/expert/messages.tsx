import { createFileRoute } from "@tanstack/react-router";
import { MessagingWorkspace } from "@/components/messaging-workspace";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";

export const Route = createFileRoute("/expert/messages")({
	component: ExpertMessagesRoute,
	head: () => ({ meta: [{ title: "Expert Messages | Laxiriir Expert" }] }),
});

function ExpertMessagesRoute() {
	return (
		<ProtectedPage requireApprovedExpert roles={["expert"]}>
			<PageShell>
				<MessagingWorkspace description="Keep client questions and consultation context in one secure thread." />
			</PageShell>
		</ProtectedPage>
	);
}
