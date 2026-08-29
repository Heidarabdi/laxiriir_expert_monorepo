import type { ExpertBookingScope } from "@repo/contracts/consultations";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarCheckIcon } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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
			<div className="grid gap-3">
				{bookingsQuery.isPending ? (
					<>
						<Skeleton className="h-28" />
						<Skeleton className="h-28" />
					</>
				) : null}
				{!bookingsQuery.isPending && bookings.length === 0 ? (
					<Card>
						<CardContent className="flex flex-col items-center gap-3 py-12 text-center">
							<CalendarCheckIcon className="size-8 text-muted-foreground" />
							<p className="font-medium">No {scope} sessions</p>
							<p className="text-muted-foreground text-sm">
								{scope === "upcoming"
									? "Confirmed client bookings will appear here."
									: "Completed and cancelled sessions will appear here."}
							</p>
						</CardContent>
					</Card>
				) : null}
				{bookings.map((booking) => (
					<Card key={booking.id}>
						<CardContent className="flex flex-col justify-between gap-4 py-5 sm:flex-row sm:items-center">
							<div>
								<p className="font-semibold">
									{booking.client.displayName ?? "Client"}
								</p>
								<p className="text-muted-foreground text-sm">
									{formatDate(booking.startsAt, "full")} ·{" "}
									{formatTimeRange(booking.startsAt, booking.endsAt)}
								</p>
							</div>
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
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
