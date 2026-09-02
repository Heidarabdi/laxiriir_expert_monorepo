import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/contact")({
	head: () => ({
		meta: [
			{ title: "Contact | Laxiriir Expert" },
			{ content: "Get help with a Laxiriir Expert account, expert review, or consultation booking.", name: "description" },
		],
	}),
	component: () => (
		<StaticPage eyebrow="Contact" title="Talk to the Laxiriir team">
			<p>Sign in and open Support from your workspace to create a request the operations team can track through resolution.</p>
			<p>
				Include the relevant booking ID when your question concerns a consultation. Never include your password or authentication cookie.
			</p>
		</StaticPage>
	),
});
