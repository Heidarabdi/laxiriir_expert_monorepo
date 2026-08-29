import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheckIcon, ClockIcon, HistoryIcon } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { useExpertDashboardSummary } from "@/hooks/use-consultations";
import { formatDate, formatTimeRange } from "@/lib/format";

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
	const summaryQuery = useExpertDashboardSummary();
	const summary = summaryQuery.data;
	const stats = [
		{
			icon: CalendarCheckIcon,
			label: "Upcoming sessions",
			value: summary?.upcomingBookings ?? 0,
		},
		{
			icon: HistoryIcon,
			label: "Past sessions",
			value: summary?.pastBookings ?? 0,
		},
		{
			icon: ClockIcon,
			label: "Open slots",
			value: summary?.openAvailability ?? 0,
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Track your consultations and manage the availability clients can book."
				eyebrow="Expert workspace"
				title={`Welcome, ${user?.displayName ?? "Expert"}`}
			/>
			{summaryQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load dashboard</AlertTitle>
					<AlertDescription>{summaryQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-3">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-3xl">
								{summaryQuery.isPending ? (
									<Skeleton className="h-9 w-10" />
								) : (
									value
								)}
							</CardTitle>
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
						<CardTitle>Next consultation</CardTitle>
						<CardDescription>
							Your nearest confirmed client session.
						</CardDescription>
					</div>
					<Button asChild size="sm">
						<Link to="/expert/sessions">View sessions</Link>
					</Button>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					{summaryQuery.isPending ? <Skeleton className="h-20" /> : null}
					{!summaryQuery.isPending && !summary?.nextBooking ? (
						<p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground text-sm">
							No upcoming consultations. Your next client booking will appear
							here.
						</p>
					) : null}
					{summary?.nextBooking ? (
						<article className="flex items-center justify-between gap-4 rounded-xl bg-muted p-4">
							<div>
								<p className="font-medium">
									{summary.nextBooking.client.displayName ?? "Client"}
								</p>
								<p className="text-muted-foreground text-sm">
									{formatDate(summary.nextBooking.startsAt)} ·{" "}
									{formatTimeRange(
										summary.nextBooking.startsAt,
										summary.nextBooking.endsAt,
									)}
								</p>
							</div>
							<CalendarCheckIcon className="text-primary" />
						</article>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
