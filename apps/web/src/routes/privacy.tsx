import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/privacy")({
	head: () => ({
		meta: [
			{ title: "Privacy | Laxiriir Expert" },
			{ content: "Review the categories of account and consultation data used by Laxiriir Expert.", name: "description" },
		],
	}),
	component: () => (
		<StaticPage eyebrow="Legal" title="Privacy">
			<p>
				The platform stores account identity, role, expert profile,
				availability, booking, message, preference, notification, and support-case information needed to provide its service.
			</p>
			<p>
				A deployment owner must replace this summary with a
				jurisdiction-appropriate privacy policy before production launch.
			</p>
		</StaticPage>
	),
});
