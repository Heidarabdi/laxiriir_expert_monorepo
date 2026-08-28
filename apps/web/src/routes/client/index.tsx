import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDaysIcon, ClockIcon, SearchIcon } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useCurrentUser } from "@/hooks/use-auth";
import { useClientBookings, useExperts } from "@/hooks/use-consultations";
import { formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/client/")({
	component: ClientDashboardRoute,
	head: () => ({ meta: [{ title: "Client Dashboard | Laxiriir Expert" }] }),
});

function ClientDashboardRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<ClientDashboard />
			</PageShell>
		</ProtectedPage>
	);
}

function ClientDashboard() {
	const { data: user } = useCurrentUser();
	const bookingsQuery = useClientBookings();
	const expertsQuery = useExperts();
	const bookings = bookingsQuery.data?.bookings ?? [];
	const experts = expertsQuery.data?.experts ?? [];
	const upcoming = bookings.filter(
		(booking) =>
			booking.status === "confirmed" && new Date(booking.startsAt) > new Date(),
	);
	const error = bookingsQuery.error ?? expertsQuery.error;
	const stats = [
		{ icon: CalendarDaysIcon, label: "Total sessions", value: bookings.length },
		{ icon: ClockIcon, label: "Upcoming", value: upcoming.length },
		{ icon: SearchIcon, label: "Available experts", value: experts.length },
	];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Review your sessions and book time with an expert from one workspace."
				eyebrow="Client dashboard"
				title={`Welcome back, ${user?.displayName ?? "Client"}`}
			/>
			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load the dashboard</AlertTitle>
					<AlertDescription>{error.message}</AlertDescription>
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
						<CardTitle>Upcoming sessions</CardTitle>
						<CardDescription>
							Your confirmed consultation schedule.
						</CardDescription>
					</div>
					<Button asChild size="sm" variant="outline">
						<Link to="/client/sessions">View all</Link>
					</Button>
				</CardHeader>
				<CardContent className="flex flex-col gap-3">
					{bookingsQuery.isPending ? (
						<>
							<Skeleton className="h-20" />
							<Skeleton className="h-20" />
						</>
					) : null}
					{!bookingsQuery.isPending && upcoming.length === 0 ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<CalendarDaysIcon />
								</EmptyMedia>
								<EmptyTitle>No upcoming sessions</EmptyTitle>
								<EmptyDescription>
									Choose an available expert to create your first booking.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button asChild>
									<Link to="/client/experts">Browse experts</Link>
								</Button>
							</EmptyContent>
						</Empty>
					) : null}
					{upcoming.slice(0, 3).map((booking) => (
						<article
							className="flex flex-col justify-between gap-4 rounded-xl bg-muted p-4 sm:flex-row sm:items-center"
							key={booking.id}
						>
							<div className="flex items-center gap-3">
								<Avatar>
									<AvatarImage
										alt={booking.expert.displayName}
										src={booking.expert.avatarUrl}
									/>
									<AvatarFallback>
										{booking.expert.displayName.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="font-medium">{booking.expert.displayName}</p>
									<p className="text-muted-foreground text-sm">
										{booking.expert.title}
									</p>
								</div>
							</div>
							<div className="sm:text-right">
								<p className="font-medium text-sm">
									{formatDate(booking.startsAt)}
								</p>
								<p className="text-muted-foreground text-xs">
									{formatTime(booking.startsAt)}
								</p>
							</div>
						</article>
					))}
				</CardContent>
			</Card>
		</div>
	);
}
