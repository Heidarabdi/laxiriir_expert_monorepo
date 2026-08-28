import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheckIcon, CalendarDaysIcon, ClockIcon } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useCurrentUser } from "@/hooks/use-auth";
import { useOwnAvailability } from "@/hooks/use-consultations";
import { formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/expert/")({
	component: ExpertDashboardRoute,
	head: () => ({ meta: [{ title: "Expert Dashboard | Laxiriir Expert" }] }),
});

function ExpertDashboardRoute() {
	return (
		<ProtectedPage requireApprovedExpert roles={["expert"]}>
			<PageShell>
				<ExpertDashboard />
			</PageShell>
		</ProtectedPage>
	);
}

function ExpertDashboard() {
	const { data: user } = useCurrentUser();
	const availabilityQuery = useOwnAvailability();
	const slots = availabilityQuery.data?.slots ?? [];
	const upcoming = slots.filter((slot) => new Date(slot.endsAt) > new Date());
	const open = upcoming.filter((slot) => !slot.booked);
	const booked = upcoming.filter((slot) => slot.booked);
	const stats = [
		{ icon: CalendarDaysIcon, label: "Upcoming slots", value: upcoming.length },
		{ icon: ClockIcon, label: "Open slots", value: open.length },
		{ icon: CalendarCheckIcon, label: "Booked slots", value: booked.length },
	];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Manage the real availability clients can book."
				eyebrow="Expert workspace"
				title={`Welcome, ${user?.displayName ?? "Expert"}`}
			/>
			{availabilityQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load availability</AlertTitle>
					<AlertDescription>{availabilityQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-3">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-3xl">{value}</CardTitle>
						</CardHeader>
						<CardContent>
							<Icon className="text-primary" />
						</CardContent>
					</Card>
				))}
			</div>
			<Card>
				<CardHeader className="flex-row items-start justify-between">
					<div>
						<CardTitle>Next availability</CardTitle>
						<CardDescription>Your nearest upcoming slots.</CardDescription>
					</div>
					<Button asChild size="sm">
						<Link to="/expert/calendar">Manage slots</Link>
					</Button>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					{availabilityQuery.isPending ? (
						<>
							<Skeleton className="h-16" />
							<Skeleton className="h-16" />
						</>
					) : null}
					{!availabilityQuery.isPending && upcoming.length === 0 ? (
						<p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
							No future availability yet. Add a slot so clients can book you.
						</p>
					) : null}
					{upcoming.slice(0, 5).map((slot) => (
						<article
							className="flex items-center justify-between gap-4 rounded-xl bg-muted p-4"
							key={slot.id}
						>
							<div>
								<p className="font-medium">{formatDate(slot.startsAt)}</p>
								<p className="text-muted-foreground text-sm">
									{formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
								</p>
							</div>
							<Badge variant={slot.booked ? "default" : "secondary"}>
								{slot.booked ? "Booked" : "Open"}
							</Badge>
						</article>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
