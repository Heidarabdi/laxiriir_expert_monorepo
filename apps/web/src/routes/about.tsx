import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "About | Laxiriir Expert" },
			{ content: "Learn how Laxiriir Expert connects clients with approved specialists and real consultation availability.", name: "description" },
		],
	}),
	component: () => (
		<StaticPage eyebrow="About" title="Expert guidance, without the friction">
			<p>
				Laxiriir Expert helps people find approved specialists and book real
				consultation time in one focused platform.
			</p>
			<p>
				Clients, experts, and administrators each have a dedicated workspace
				backed by the same secure API.
			</p>
		</StaticPage>
	),
});
