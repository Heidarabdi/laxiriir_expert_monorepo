import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareIcon } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { PlannedFeature } from "@/components/planned-feature";
import { ProtectedPage } from "@/components/protected-page";
import { WorkspaceHeading } from "@/components/workspace-heading";

export const Route = createFileRoute("/client/messages")({
	component: ClientMessagesRoute,
	head: () => ({ meta: [{ title: "Messages | Laxiriir Expert" }] }),
});

function ClientMessagesRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<div className="flex flex-col gap-6">
					<WorkspaceHeading
						description="Secure consultation messaging will appear here when the messaging API is available."
						eyebrow="Communication"
						title="Messages"
					/>
					<PlannedFeature
						description="The previous Nuxt screen used demo conversations. The TanStack app does not present mock messages as real data."
						icon={MessageSquareIcon}
						title="Messaging is the next product milestone"
					/>
				</div>
			</PageShell>
		</ProtectedPage>
	);
}
