import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/terms")({
	head: () => ({
		meta: [
			{ title: "Terms | Laxiriir Expert" },
			{ content: "Review the basic service responsibilities for Laxiriir Expert clients and experts.", name: "description" },
		],
	}),
	component: () => (
		<StaticPage eyebrow="Legal" title="Terms of service">
			<p>
				Users must provide accurate account information and use the platform
				lawfully. Experts are responsible for the professional guidance they
				provide.
			</p>
			<p>
				A deployment owner must publish complete, reviewed terms before
				accepting production users.
			</p>
		</StaticPage>
	),
});
