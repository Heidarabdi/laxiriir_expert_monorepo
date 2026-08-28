import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/faq")({
	component: () => (
		<StaticPage eyebrow="FAQ" title="Common questions">
			<p>
				<strong>How do bookings work?</strong>
				<br />
				Create a client account, choose an approved expert, and reserve one of
				their open slots.
			</p>
			<p>
				<strong>How do experts join?</strong>
				<br />
				Register as an expert. An administrator reviews the account before the
				expert workspace unlocks.
			</p>
			<p>
				<strong>Where are times shown?</strong>
				<br />
				The interface displays dates in your device’s local timezone.
			</p>
		</StaticPage>
	),
});
