import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/privacy")({
	component: () => (
		<StaticPage eyebrow="Legal" title="Privacy">
			<p>
				The platform stores account identity, role, expert profile,
				availability, and booking information needed to provide its service.
			</p>
			<p>
				A deployment owner must replace this summary with a
				jurisdiction-appropriate privacy policy before production launch.
			</p>
		</StaticPage>
	),
});
