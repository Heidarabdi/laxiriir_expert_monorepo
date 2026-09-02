import { createFileRoute, Link } from "@tanstack/react-router";
import {
	CalendarClockIcon,
	ChartNoAxesCombinedIcon,
	CircleDollarSignIcon,
	ShieldAlertIcon,
	ShieldCheckIcon,
	UsersIcon,
} from "lucide-react";

import {
	ActivityBarChart,
	StatusDonutChart,
} from "@/components/dashboard-charts";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { useAdminExperts, useAdminUsers } from "@/hooks/use-auth";
import { useAdminBookings } from "@/hooks/use-consultations";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
	component: AdminRoute,
	head: () => ({ meta: [{ title: "Admin Dashboard | Laxiriir Expert" }] }),
});

function AdminRoute() {
	return (
		<ProtectedPage roles={["admin"]}>
			<PageShell>
				<AdminDashboard />
			</PageShell>
		</ProtectedPage>
	);
}

function AdminDashboard() {
	const expertsQuery = useAdminExperts();
	const usersQuery = useAdminUsers();
	const bookingsQuery = useAdminBookings();
	const experts = expertsQuery.data?.experts ?? [];
	const users = usersQuery.data?.users ?? [];
	const bookings = bookingsQuery.data?.bookings ?? [];
	const pending = experts.filter(
		(expert) => expert.expertStatus === "pending_review",
	);
	const approved = experts.filter(
		(expert) => expert.expertStatus === "approved",
	);
	const statusData = [
		{ label: "Pending", value: pending.length },
		{ label: "Approved", value: approved.length },
		{
			label: "Rejected",
			value: experts.filter((expert) => expert.expertStatus === "rejected")
				.length,
		},
		{
			label: "Suspended",
			value: experts.filter((expert) => expert.expertStatus === "suspended")
				.length,
		},
	];
	const applicationActivity = Array.from({ length: 6 }, (_, index) => {
		const date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - 5 + index);
		return {
			label: date.toLocaleDateString(undefined, { month: "short" }),
			primary: experts.filter((expert) => {
				const created = new Date(expert.createdAt);
				return (
					created.getMonth() === date.getMonth() &&
					created.getFullYear() === date.getFullYear()
				);
			}).length,
		};
	});
	const upcomingBookings = bookings.filter(
		(booking) =>
			booking.status === "confirmed" && new Date(booking.startsAt) > new Date(),
	);
	const completedValue = bookings
		.filter(
			(booking) =>
				booking.status === "confirmed" &&
				new Date(booking.endsAt) <= new Date(),
		)
		.reduce((total, booking) => total + booking.expert.hourlyRateCents, 0);
	const stats = [
		{
			description: "All client, expert, and admin identities",
			icon: UsersIcon,
			label: "Total users",
			value: users.length,
		},
		{
			description: "Confirmed consultations still ahead",
			icon: CalendarClockIcon,
			label: "Upcoming bookings",
			value: upcomingBookings.length,
		},
		{
			description: "Applications requiring an admin decision",
			icon: ShieldAlertIcon,
			label: "Review queue",
			value: pending.length,
		},
		{
			description: "Listed value of completed consultations",
			icon: CircleDollarSignIcon,
			label: "Completed value",
			value: new Intl.NumberFormat(undefined, {
				currency: "USD",
				maximumFractionDigits: 0,
				style: "currency",
			}).format(completedValue / 100),
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Monitor marketplace trust and focus on the expert applications needing action."
				eyebrow="Administration"
				title="Platform overview"
			/>
			{expertsQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load admin overview</AlertTitle>
					<AlertDescription>{expertsQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ description, icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-3xl">
								{expertsQuery.isPending ? (
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
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle>Application volume</CardTitle>
						<CardDescription>
							New expert identities created during the last six months.
						</CardDescription>
						<CardAction className="rounded-lg bg-accent p-3 text-accent-foreground">
							<ChartNoAxesCombinedIcon />
						</CardAction>
					</CardHeader>
					<CardContent>
						<ActivityBarChart
							data={applicationActivity}
							primaryLabel="Applications"
						/>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Expert status mix</CardTitle>
						<CardDescription>
							The current moderation state of every expert account.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<StatusDonutChart data={statusData} />
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Review queue</CardTitle>
					<CardDescription>
						The newest expert applications waiting for an admin decision.
					</CardDescription>
					<CardAction>
						<Button asChild size="sm" variant="outline">
							<Link to="/admin/experts">Manage experts</Link>
						</Button>
					</CardAction>
				</CardHeader>
				<CardContent>
					{expertsQuery.isPending ? <Skeleton className="h-48" /> : null}
					{!expertsQuery.isPending && pending.length === 0 ? (
						<Empty className="min-h-56 border">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<ShieldCheckIcon />
								</EmptyMedia>
								<EmptyTitle>Review queue is clear</EmptyTitle>
								<EmptyDescription>
									New expert applications will appear here automatically.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : null}
					{pending.length > 0 ? (
						<div className="flex flex-col divide-y">
							{pending.slice(0, 5).map((expert) => (
								<div
									className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
									key={expert.identityUserId}
								>
									<div className="flex min-w-0 items-center gap-3">
										<Avatar>
											<AvatarFallback>
												{expert.displayName.slice(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="min-w-0">
											<p className="truncate font-medium">
												{expert.displayName}
											</p>
											<p className="truncate text-muted-foreground text-xs">
												{expert.email}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Badge variant="secondary">Pending review</Badge>
										<span className="text-muted-foreground text-xs">
											{formatDate(expert.createdAt)}
										</span>
									</div>
								</div>
							))}
						</div>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
