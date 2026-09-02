import type { ExpertBookingScope } from "@repo/contracts/consultations";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheckIcon, ClockIcon } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkspaceHeading } from "@/components/workspace-heading";
import {
	useExpertBookings,
	useExpertDashboardSummary,
} from "@/hooks/use-consultations";
import { formatDate, formatTimeRange } from "@/lib/format";

export const Route = createFileRoute("/expert/sessions")({
	component: ExpertSessionsRoute,
	head: () => ({ meta: [{ title: "Expert Sessions | Laxiriir Expert" }] }),
});

function ExpertSessionsRoute() {
	return (
		<ProtectedPage requireApprovedExpert roles={["expert"]}>
			<PageShell>
				<ExpertSessions />
			</PageShell>
		</ProtectedPage>
	);
}

function ExpertSessions() {
	const [scope, setScope] = useState<ExpertBookingScope>("upcoming");
	const bookingsQuery = useExpertBookings(scope);
	const summaryQuery = useExpertDashboardSummary();
	const bookings = bookingsQuery.data?.bookings ?? [];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="See confirmed upcoming consultations and your completed or cancelled history."
				eyebrow="Expert workspace"
				title="Sessions"
			/>
			<Tabs
				onValueChange={(value) =>
					setScope(value === "past" ? "past" : "upcoming")
				}
				value={scope}
			>
				<TabsList>
					<TabsTrigger value="upcoming">
						Upcoming ({summaryQuery.data?.upcomingBookings ?? 0})
					</TabsTrigger>
					<TabsTrigger value="past">
						Past ({summaryQuery.data?.pastBookings ?? 0})
					</TabsTrigger>
				</TabsList>
			</Tabs>
			{bookingsQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load sessions</AlertTitle>
					<AlertDescription>{bookingsQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="flex flex-col gap-3">
				{bookingsQuery.isPending ? (
					<>
						<Skeleton className="h-28" />
						<Skeleton className="h-28" />
					</>
				) : null}
				{!bookingsQuery.isPending && bookings.length === 0 ? (
					<Empty className="min-h-72 border bg-card shadow-sm">
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<CalendarCheckIcon />
							</EmptyMedia>
							<EmptyTitle>No {scope} sessions</EmptyTitle>
							<EmptyDescription>
								{scope === "upcoming"
									? "Confirmed client bookings will appear here."
									: "Completed and cancelled sessions will appear here."}
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				) : null}
				{bookings.map((booking) => (
					<Card key={booking.id}>
						<CardHeader>
							<CardTitle className="flex items-center gap-3">
								<Avatar>
									<AvatarFallback>
										{(booking.client.displayName ?? "Client")
											.slice(0, 2)
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<span>{booking.client.displayName ?? "Client"}</span>
							</CardTitle>
							<CardDescription>
								Consultation with a confirmed client
							</CardDescription>
							<CardAction>
								<Badge
									variant={
										booking.status === "cancelled" ? "secondary" : "default"
									}
								>
									{booking.status === "cancelled"
										? "Cancelled"
										: scope === "past"
											? "Completed"
											: "Confirmed"}
								</Badge>
							</CardAction>
						</CardHeader>
						<CardContent>
							<div className="grid gap-3 rounded-xl border bg-muted/40 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
								<div className="flex items-center gap-3">
									<div className="rounded-lg bg-accent p-2.5 text-accent-foreground">
										<CalendarCheckIcon />
									</div>
									<div className="flex flex-col gap-0.5">
										<p className="font-medium">
											{formatDate(booking.startsAt, "full")}
										</p>
										<p className="text-muted-foreground text-xs">
											Your local timezone
										</p>
									</div>
								</div>
								<p className="flex items-center gap-2 font-medium text-sm">
									<ClockIcon className="text-primary" />
									{formatTimeRange(booking.startsAt, booking.endsAt)}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
