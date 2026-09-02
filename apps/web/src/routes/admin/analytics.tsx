import { createFileRoute } from "@tanstack/react-router";
import {
	CalendarCheckIcon,
	ChartNoAxesCombinedIcon,
	UserRoundPlusIcon,
	UsersIcon,
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
import { useAdminExperts, useAdminUsers } from "@/hooks/use-auth";
import { useAdminBookings } from "@/hooks/use-consultations";

export const Route = createFileRoute("/admin/analytics")({
	component: AdminAnalyticsRoute,
	head: () => ({ meta: [{ title: "Analytics | Laxiriir Expert" }] }),
});

function AdminAnalyticsRoute() {
	return (
		<ProtectedPage roles={["admin"]}>
			<PageShell>
				<AdminAnalytics />
			</PageShell>
		</ProtectedPage>
	);
}

function AdminAnalytics() {
	const usersQuery = useAdminUsers();
	const expertsQuery = useAdminExperts();
	const bookingsQuery = useAdminBookings();
	const users = usersQuery.data?.users ?? [];
	const experts = expertsQuery.data?.experts ?? [];
	const bookings = bookingsQuery.data?.bookings ?? [];
	const loading =
		usersQuery.isPending || expertsQuery.isPending || bookingsQuery.isPending;
	const error = usersQuery.error ?? expertsQuery.error ?? bookingsQuery.error;
	const confirmed = bookings.filter(
		(booking) => booking.status === "confirmed",
	);
	const cancelled = bookings.filter(
		(booking) => booking.status === "cancelled",
	);
	const approved = experts.filter(
		(expert) => expert.expertStatus === "approved",
	);
	const monthly = Array.from({ length: 6 }, (_, index) => {
		const date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - 5 + index);
		const sameMonth = (value: string) => {
			const candidate = new Date(value);
			return (
				candidate.getMonth() === date.getMonth() &&
				candidate.getFullYear() === date.getFullYear()
			);
		};
		return {
			label: date.toLocaleDateString(undefined, { month: "short" }),
			primary: users.filter((user) => sameMonth(user.createdAt)).length,
			secondary: bookings.filter((booking) => sameMonth(booking.createdAt))
				.length,
		};
	});
	const stats = [
		{ icon: UsersIcon, label: "Users", value: users.length },
		{
			icon: UserRoundPlusIcon,
			label: "Approved experts",
			value: approved.length,
		},
		{ icon: CalendarCheckIcon, label: "Bookings", value: bookings.length },
		{
			icon: ChartNoAxesCombinedIcon,
			label: "Cancellation rate",
			value:
				bookings.length === 0
					? "0%"
					: `${Math.round((cancelled.length / bookings.length) * 100)}%`,
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Measure account growth, marketplace activity, and booking outcomes from live platform records."
				eyebrow="Intelligence"
				title="Analytics"
			/>
			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load analytics</AlertTitle>
					<AlertDescription>{error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-3xl tabular-nums">
								{loading ? <Skeleton className="h-9 w-14" /> : value}
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
						<CardTitle>Marketplace activity</CardTitle>
						<CardDescription>
							New users and bookings created during the last six months.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ActivityBarChart
							data={monthly}
							primaryLabel="New users"
							secondaryLabel="Bookings"
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Booking outcomes</CardTitle>
						<CardDescription>
							Current confirmed and cancelled booking mix.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<StatusDonutChart
							data={[
								{ label: "Confirmed", value: confirmed.length },
								{ label: "Cancelled", value: cancelled.length },
							]}
						/>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
