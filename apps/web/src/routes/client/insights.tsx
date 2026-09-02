import { createFileRoute } from "@tanstack/react-router";
import {
	CalendarCheckIcon,
	Clock3Icon,
	RotateCcwIcon,
	WalletCardsIcon,
} from "lucide-react";

import {
	ActivityBarChart,
	StatusDonutChart,
} from "@/components/dashboard-charts";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useClientBookings } from "@/hooks/use-consultations";

export const Route = createFileRoute("/client/insights")({
	component: ClientInsightsRoute,
	head: () => ({ meta: [{ title: "Insights | Laxiriir Expert" }] }),
});

function ClientInsightsRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<ClientInsights />
			</PageShell>
		</ProtectedPage>
	);
}

function ClientInsights() {
	const bookingsQuery = useClientBookings();
	const bookings = bookingsQuery.data?.bookings ?? [];
	const now = new Date();
	const completed = bookings.filter(
		(booking) =>
			booking.status === "confirmed" && new Date(booking.endsAt) <= now,
	);
	const upcoming = bookings.filter(
		(booking) =>
			booking.status === "confirmed" && new Date(booking.startsAt) > now,
	);
	const cancelled = bookings.filter(
		(booking) => booking.status === "cancelled",
	);
	const totalSpend = completed.reduce(
		(total, booking) => total + booking.expert.hourlyRateCents,
		0,
	);
	const monthlyActivity = Array.from({ length: 6 }, (_, index) => {
		const date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - 5 + index);
		const inMonth = (value: string) => {
			const sessionDate = new Date(value);
			return (
				sessionDate.getMonth() === date.getMonth() &&
				sessionDate.getFullYear() === date.getFullYear()
			);
		};
		return {
			label: date.toLocaleDateString(undefined, { month: "short" }),
			primary: completed.filter((booking) => inMonth(booking.startsAt)).length,
			secondary: cancelled.filter((booking) => inMonth(booking.startsAt))
				.length,
		};
	});
	const categories = Object.entries(
		completed.reduce<Record<string, number>>((counts, booking) => {
			counts[booking.expert.category] =
				(counts[booking.expert.category] ?? 0) + 1;
			return counts;
		}, {}),
	).map(([label, value]) => ({ label, value }));
	const stats = [
		{ icon: CalendarCheckIcon, label: "Completed", value: completed.length },
		{ icon: Clock3Icon, label: "Upcoming", value: upcoming.length },
		{ icon: RotateCcwIcon, label: "Cancelled", value: cancelled.length },
		{
			icon: WalletCardsIcon,
			label: "Completed value",
			value: new Intl.NumberFormat(undefined, {
				currency: "USD",
				maximumFractionDigits: 0,
				style: "currency",
			}).format(totalSpend / 100),
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Understand your consultation history, spending, and the expertise you use most."
				eyebrow="Analytics"
				title="Insights"
			/>
			{bookingsQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load insights</AlertTitle>
					<AlertDescription>{bookingsQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-3xl tabular-nums">
								{bookingsQuery.isPending ? (
									<Skeleton className="h-9 w-16" />
								) : (
									value
								)}
							</CardTitle>
							<CardAction className="rounded-lg bg-accent p-3 text-accent-foreground">
								<Icon />
							</CardAction>
						</CardHeader>
					</Card>
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(20rem,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle>Session history</CardTitle>
						<CardDescription>
							Completed and cancelled sessions by month.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ActivityBarChart
							data={monthlyActivity}
							primaryLabel="Completed"
							secondaryLabel="Cancelled"
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Expertise mix</CardTitle>
						<CardDescription>
							Completed sessions grouped by specialty.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{categories.length > 0 ? (
							<StatusDonutChart data={categories} />
						) : (
							<p className="flex h-64 items-center justify-center text-center text-muted-foreground text-sm">
								Your expertise mix will appear after your first completed
								session.
							</p>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
