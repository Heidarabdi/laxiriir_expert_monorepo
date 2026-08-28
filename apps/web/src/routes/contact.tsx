import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/contact")({
	component: () => (
		<StaticPage eyebrow="Contact" title="Talk to the Laxiriir team">
			<p>
				For account, expert-review, or booking questions, contact the platform
				support address configured for your deployment.
			</p>
			<p>
				Please include your account email and relevant booking ID, but never
				send your password.
			</p>
		</StaticPage>
	),
});
