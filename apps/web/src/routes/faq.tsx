import { createFileRoute } from "@tanstack/react-router";
import { StaticPage } from "@/components/static-page";
export const Route = createFileRoute("/faq")({
	head: () => ({
		meta: [
			{ title: "FAQ | Laxiriir Expert" },
			{ content: "Answers about expert approval, consultation bookings, messages, and support on Laxiriir Expert.", name: "description" },
		],
	}),
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
			<p><strong>Can I message an expert?</strong><br />Yes. Every booking has a private conversation shared only by the client and expert.</p>
			<p><strong>How do I get help?</strong><br />Open Support from your client or expert workspace. Administrators can assign and resolve each case.</p>
		</StaticPage>
	),
});
