import { createFileRoute, Link } from "@tanstack/react-router";
import {
	CalendarCheckIcon,
	ClockIcon,
	DollarSignIcon,
	HistoryIcon,
	TrendingUpIcon,
} from "lucide-react";

import { ActivityBarChart } from "@/components/dashboard-charts";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useCurrentUser } from "@/hooks/use-auth";
import {
	useExpertBookings,
	useExpertDashboardSummary,
	useExperts,
} from "@/hooks/use-consultations";
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
	const upcomingQuery = useExpertBookings("upcoming");
	const pastQuery = useExpertBookings("past");
	const expertsQuery = useExperts();
	const summary = summaryQuery.data;
	const upcoming = upcomingQuery.data?.bookings ?? [];
	const past = pastQuery.data?.bookings ?? [];
	const ownProfile = expertsQuery.data?.experts.find(
		(expert) => expert.id === user?.userId,
	);
	const projectedRevenue = upcoming.length * (ownProfile?.hourlyRateCents ?? 0);
	const activity = Array.from({ length: 6 }, (_, index) => {
		const date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - 5 + index);
		const inMonth = (value: string) => {
			const bookingDate = new Date(value);
			return (
				bookingDate.getMonth() === date.getMonth() &&
				bookingDate.getFullYear() === date.getFullYear()
			);
		};
		return {
			label: date.toLocaleDateString(undefined, { month: "short" }),
			primary: past.filter(
				(booking) =>
					booking.status === "confirmed" && inMonth(booking.startsAt),
			).length,
			secondary: past.filter(
				(booking) =>
					booking.status === "cancelled" && inMonth(booking.startsAt),
			).length,
		};
	});
	const stats = [
		{
			description: "Confirmed consultations ahead",
			icon: CalendarCheckIcon,
			label: "Upcoming sessions",
			value: summary?.upcomingBookings ?? 0,
		},
		{
			description: "Completed and cancelled history",
			icon: HistoryIcon,
			label: "Past sessions",
			value: summary?.pastBookings ?? 0,
		},
		{
			description: "Times clients can reserve now",
			icon: ClockIcon,
			label: "Open slots",
			value: summary?.openAvailability ?? 0,
		},
		{
			description: "Value of confirmed upcoming work",
			icon: DollarSignIcon,
			label: "Projected revenue",
			value: new Intl.NumberFormat(undefined, {
				currency: "USD",
				maximumFractionDigits: 0,
				style: "currency",
			}).format(projectedRevenue / 100),
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
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ description, icon: Icon, label, value }) => (
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
							<CardAction className="rounded-lg bg-accent p-3 text-accent-foreground">
								<Icon />
							</CardAction>
						</CardHeader>
						<CardContent className="text-muted-foreground text-xs">
							{description}
						</CardContent>
					</Card>
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle>Session performance</CardTitle>
						<CardDescription>
							Completed and cancelled consultations over six months.
						</CardDescription>
						<CardAction className="rounded-lg bg-accent p-3 text-accent-foreground">
							<TrendingUpIcon />
						</CardAction>
					</CardHeader>
					<CardContent>
						<ActivityBarChart
							data={activity}
							primaryLabel="Completed"
							secondaryLabel="Cancelled"
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Schedule health</CardTitle>
						<CardDescription>
							A quick read on demand and open capacity.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<div>
							<div className="mb-2 flex items-center justify-between text-sm">
								<span className="text-muted-foreground">Booked capacity</span>
								<span className="font-semibold tabular-nums">
									{upcoming.length + (summary?.openAvailability ?? 0) === 0
										? "0%"
										: `${Math.round((upcoming.length / (upcoming.length + (summary?.openAvailability ?? 0))) * 100)}%`}
								</span>
							</div>
							<progress
								aria-label="Booked capacity"
								className="h-2 w-full overflow-hidden rounded-full bg-muted accent-primary"
								max={Math.max(
									1,
									upcoming.length + (summary?.openAvailability ?? 0),
								)}
								value={upcoming.length}
							/>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div className="rounded-xl bg-muted p-4">
								<p className="text-muted-foreground text-xs">Booked</p>
								<p className="mt-1 font-semibold text-2xl tabular-nums">
									{upcoming.length}
								</p>
							</div>
							<div className="rounded-xl bg-muted p-4">
								<p className="text-muted-foreground text-xs">Open</p>
								<p className="mt-1 font-semibold text-2xl tabular-nums">
									{summary?.openAvailability ?? 0}
								</p>
							</div>
						</div>
						<Button asChild variant="outline">
							<Link to="/expert/calendar">Manage availability</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Next consultation</CardTitle>
					<CardDescription>
						Your nearest confirmed client session.
					</CardDescription>
					<CardAction>
						<Button asChild size="sm" variant="outline">
							<Link to="/expert/sessions">View all sessions</Link>
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					{summaryQuery.isPending ? <Skeleton className="h-32" /> : null}
					{!summaryQuery.isPending && !summary?.nextBooking ? (
						<Empty className="min-h-56 border">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<CalendarCheckIcon />
								</EmptyMedia>
								<EmptyTitle>No upcoming consultations</EmptyTitle>
								<EmptyDescription>
									Your next confirmed client booking will appear here.
								</EmptyDescription>
							</EmptyHeader>
							<Button asChild variant="outline">
								<Link to="/expert/calendar">Review availability</Link>
							</Button>
						</Empty>
					) : null}
					{summary?.nextBooking ? (
						<article className="grid gap-4 rounded-xl border bg-muted/40 p-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
							<div className="flex size-16 flex-col items-center justify-center rounded-xl bg-primary text-primary-foreground">
								<span className="font-semibold text-lg leading-none">
									{new Date(summary.nextBooking.startsAt).getDate()}
								</span>
								<span className="mt-1 text-[0.65rem] uppercase tracking-wide">
									{new Date(summary.nextBooking.startsAt).toLocaleDateString(
										undefined,
										{ month: "short" },
									)}
								</span>
							</div>
							<div className="flex min-w-0 flex-col gap-1">
								<p className="truncate font-heading font-semibold text-base">
									{summary.nextBooking.client.displayName ?? "Client"}
								</p>
								<p className="text-muted-foreground text-sm">
									{formatDate(summary.nextBooking.startsAt, "full")}
								</p>
							</div>
							<div className="flex items-center gap-2 font-medium text-sm sm:justify-self-end">
								<ClockIcon className="text-primary" />
								{formatTimeRange(
									summary.nextBooking.startsAt,
									summary.nextBooking.endsAt,
								)}
							</div>
						</article>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
