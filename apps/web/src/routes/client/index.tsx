import { createFileRoute, Link } from "@tanstack/react-router";
import {
	CalendarDaysIcon,
	CheckCircle2Icon,
	ClockIcon,
	SearchIcon,
	WalletCardsIcon,
} from "lucide-react";

import { ActivityBarChart } from "@/components/dashboard-charts";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
	const completed = bookings.filter(
		(booking) =>
			booking.status === "confirmed" && new Date(booking.endsAt) <= new Date(),
	);
	const committedSpend = bookings
		.filter((booking) => booking.status === "confirmed")
		.reduce((total, booking) => total + booking.expert.hourlyRateCents, 0);
	const activity = Array.from({ length: 6 }, (_, index) => {
		const date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - 5 + index);
		return {
			label: date.toLocaleDateString(undefined, { month: "short" }),
			primary: completed.filter((booking) => {
				const booked = new Date(booking.startsAt);
				return (
					booked.getMonth() === date.getMonth() &&
					booked.getFullYear() === date.getFullYear()
				);
			}).length,
		};
	});
	const error = bookingsQuery.error ?? expertsQuery.error;
	const stats = [
		{ icon: CalendarDaysIcon, label: "All bookings", value: bookings.length },
		{ icon: ClockIcon, label: "Upcoming", value: upcoming.length },
		{ icon: CheckCircle2Icon, label: "Completed", value: completed.length },
		{
			icon: WalletCardsIcon,
			label: "Committed spend",
			value: new Intl.NumberFormat(undefined, {
				currency: "USD",
				maximumFractionDigits: 0,
				style: "currency",
			}).format(committedSpend / 100),
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<WorkspaceHeading
					description="Review your sessions and book time with an expert from one workspace."
					eyebrow="Client dashboard"
					title={`Welcome back, ${user?.displayName ?? "Client"}`}
				/>
				<Button asChild>
					<Link to="/client/experts">
						<SearchIcon data-icon="inline-start" />
						Find an expert
					</Link>
				</Button>
			</div>
			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load the dashboard</AlertTitle>
					<AlertDescription>{error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card className="shadow-sm" key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="font-semibold text-3xl tabular-nums">
								{value}
							</CardTitle>
							<CardAction>
								<span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
									<Icon className="size-4" />
								</span>
							</CardAction>
						</CardHeader>
					</Card>
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(18rem,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle>Consultation activity</CardTitle>
						<CardDescription>
							Completed sessions across the last six months.
						</CardDescription>
						<CardAction>
							<Button asChild size="sm" variant="ghost">
								<Link to="/client/insights">Open insights</Link>
							</Button>
						</CardAction>
					</CardHeader>
					<CardContent>
						<ActivityBarChart data={activity} primaryLabel="Sessions" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Recommended experts</CardTitle>
						<CardDescription>
							Active specialists you can book now.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-2">
						{experts.slice(0, 3).map((expert) => (
							<Link
								className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
								key={expert.id}
								params={{ id: expert.id }}
								to="/experts/$id"
							>
								<Avatar>
									<AvatarImage
										alt={expert.displayName}
										src={expert.avatarUrl}
									/>
									<AvatarFallback>
										{expert.displayName.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1">
									<p className="truncate font-medium text-sm">
										{expert.displayName}
									</p>
									<p className="truncate text-muted-foreground text-xs">
										{expert.title}
									</p>
								</div>
								<span className="font-medium text-xs">
									${expert.hourlyRateCents / 100}
								</span>
							</Link>
						))}
						<Button asChild className="mt-2" variant="outline">
							<Link to="/client/experts">
								<SearchIcon data-icon="inline-start" />
								Browse all experts
							</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Upcoming sessions</CardTitle>
					<CardDescription>
						Your confirmed consultation schedule.
					</CardDescription>
					<CardAction>
						<Button asChild size="sm" variant="outline">
							<Link to="/client/bookings">View all</Link>
						</Button>
					</CardAction>
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
