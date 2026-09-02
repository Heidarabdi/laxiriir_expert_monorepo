import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/pricing")({
	head: () => ({
		meta: [
			{ title: "Pricing | Laxiriir Expert" },
			{ content: "Review transparent expert consultation rates before choosing an available time.", name: "description" },
		],
	}),
	component: () => (
		<StaticPage eyebrow="Pricing" title="Expert rates are transparent">
			<p>
				Each expert profile shows its session price. The current platform does
				not yet collect payments in the web app, so payment processing must be
				added before commercial launch.
			</p>
			<p>Creating an account and browsing experts does not create a charge. Final payment, refund, and payout terms will be published when the payment integration is enabled.</p>
		</StaticPage>
	),
});
