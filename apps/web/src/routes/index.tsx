import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	CalendarCheckIcon,
	ShieldCheckIcon,
	UsersIcon,
} from "lucide-react";

import { PublicShell } from "@/components/public-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
	component: Home,
	head: () => ({
		meta: [{ title: "Laxiriir Expert | Book trusted expertise" }],
	}),
});

function Home() {
	const benefits = [
		{
			icon: UsersIcon,
			title: "Approved experts",
			copy: "Browse specialists reviewed by the platform team.",
		},
		{
			icon: CalendarCheckIcon,
			title: "Real availability",
			copy: "Reserve open time directly—no fake schedules or back-and-forth.",
		},
		{
			icon: ShieldCheckIcon,
			title: "One secure account",
			copy: "Better Auth keeps client, expert, and admin access together.",
		},
	];
	return (
		<PublicShell>
			<main>
				<section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:py-32">
					<div>
						<p className="mb-4 font-medium text-muted-foreground text-sm uppercase tracking-[0.2em]">
							Advice that moves work forward
						</p>
						<h1 className="text-balance font-semibold text-5xl tracking-[-0.04em] sm:text-7xl">
							Meet the right expert. Book the right moment.
						</h1>
						<p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground leading-8">
							Laxiriir connects clients with approved experts through real
							profiles, live availability, and a focused consultation workspace.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<Button asChild size="lg">
								<Link to="/experts">
									Browse experts
									<ArrowRightIcon data-icon="inline-end" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="outline">
								<Link to="/register">Create an account</Link>
							</Button>
						</div>
					</div>
					<Card className="bg-primary text-primary-foreground">
						<CardHeader>
							<CardTitle className="text-3xl">
								Built for real consultations
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6 text-primary-foreground/75">
							<p>
								No demo bookings. No static expert data. Every available time
								and account status comes from the API.
							</p>
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-xl bg-primary-foreground/10 p-4">
									<p className="font-semibold text-3xl text-primary-foreground">
										3
									</p>
									<p className="text-sm">role workspaces</p>
								</div>
								<div className="rounded-xl bg-primary-foreground/10 p-4">
									<p className="font-semibold text-3xl text-primary-foreground">
										1
									</p>
									<p className="text-sm">shared platform</p>
								</div>
							</div>
						</CardContent>
					</Card>
				</section>
				<section className="border-y bg-muted/40">
					<div className="mx-auto grid max-w-7xl gap-4 px-4 py-16 sm:px-6 md:grid-cols-3">
						{benefits.map(({ icon: Icon, title, copy }) => (
							<Card key={title}>
								<CardHeader>
									<Icon className="mb-4 size-6" />
									<CardTitle>{title}</CardTitle>
								</CardHeader>
								<CardContent className="text-muted-foreground text-sm">
									{copy}
								</CardContent>
							</Card>
						))}
					</div>
				</section>
			</main>
		</PublicShell>
	);
}
