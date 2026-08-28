import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/pricing")({
	component: () => (
		<StaticPage eyebrow="Pricing" title="Expert rates are transparent">
			<p>
				Each expert profile shows its session price. The current platform does
				not yet collect payments in the web app, so payment processing must be
				added before commercial launch.
			</p>
		</StaticPage>
	),
});
