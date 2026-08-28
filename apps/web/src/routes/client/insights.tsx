import { createFileRoute } from "@tanstack/react-router";
import { ChartNoAxesCombinedIcon } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { PlannedFeature } from "@/components/planned-feature";
import { ProtectedPage } from "@/components/protected-page";
import { WorkspaceHeading } from "@/components/workspace-heading";

export const Route = createFileRoute("/client/insights")({
	component: ClientInsightsRoute,
	head: () => ({ meta: [{ title: "Insights | Laxiriir Expert" }] }),
});

function ClientInsightsRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<div className="flex flex-col gap-6">
					<WorkspaceHeading
						description="Real session analytics will be derived from consultation history."
						eyebrow="Analytics"
						title="Insights"
					/>
					<PlannedFeature
						description="The former Nuxt charts were static demo values. This page is ready for the future analytics endpoint."
						icon={ChartNoAxesCombinedIcon}
						title="No analytics data yet"
					/>
				</div>
			</PageShell>
		</ProtectedPage>
	);
}
