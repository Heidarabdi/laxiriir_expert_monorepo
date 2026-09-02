import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	CalendarDaysIcon,
	ClockIcon,
	UserRoundIcon,
	VideoIcon,
} from "lucide-react";

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
import { useExpertBookings } from "@/hooks/use-consultations";
import { formatDate, formatTimeRange } from "@/lib/format";

export const Route = createFileRoute("/expert/sessions/$sessionId")({
	component: ExpertSessionDetailRoute,
	head: () => ({ meta: [{ title: "Session Details | Laxiriir Expert" }] }),
});

function ExpertSessionDetailRoute() {
	return (
		<ProtectedPage requireApprovedExpert roles={["expert"]}>
			<PageShell>
				<ExpertSessionDetail />
			</PageShell>
		</ProtectedPage>
	);
}

function ExpertSessionDetail() {
	const { sessionId } = Route.useParams();
	const upcomingQuery = useExpertBookings("upcoming");
	const pastQuery = useExpertBookings("past");
	const booking = [
		...(upcomingQuery.data?.bookings ?? []),
		...(pastQuery.data?.bookings ?? []),
	].find((item) => item.id === sessionId);
	const loading = upcomingQuery.isPending || pastQuery.isPending;
	const error = upcomingQuery.error ?? pastQuery.error;
	return (
		<div className="flex flex-col gap-6">
			<div>
				<Button asChild className="mb-4" size="sm" variant="ghost">
					<Link to="/expert/sessions">
						<ArrowLeftIcon data-icon="inline-start" />
						Back to sessions
					</Link>
				</Button>
				<WorkspaceHeading
					description="Review the client, schedule, and current consultation state."
					eyebrow="Consultation"
					title="Session details"
				/>
			</div>
			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load session</AlertTitle>
					<AlertDescription>{error.message}</AlertDescription>
				</Alert>
			) : null}
			{loading ? <Skeleton className="h-96" /> : null}
			{!loading && !booking ? (
				<Alert variant="destructive">
					<AlertTitle>Session not found</AlertTitle>
					<AlertDescription>
						This booking is not part of your consultation history.
					</AlertDescription>
				</Alert>
			) : null}
			{booking ? (
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(19rem,0.8fr)]">
					<Card>
						<CardHeader>
							<CardTitle>
								{booking.client.displayName ?? "Client consultation"}
							</CardTitle>
							<CardDescription>Booking ID {booking.id}</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
							<div className="flex gap-3 rounded-xl bg-muted p-4">
								<UserRoundIcon className="text-primary" />
								<div>
									<p className="text-muted-foreground text-xs">Client</p>
									<p className="font-medium">
										{booking.client.displayName ?? "Client"}
									</p>
								</div>
							</div>
							<div className="flex gap-3 rounded-xl bg-muted p-4">
								<CalendarDaysIcon className="text-primary" />
								<div>
									<p className="text-muted-foreground text-xs">Date</p>
									<p className="font-medium">
										{formatDate(booking.startsAt, "full")}
									</p>
								</div>
							</div>
							<div className="flex gap-3 rounded-xl bg-muted p-4">
								<ClockIcon className="text-primary" />
								<div>
									<p className="text-muted-foreground text-xs">Time</p>
									<p className="font-medium">
										{formatTimeRange(booking.startsAt, booking.endsAt)}
									</p>
								</div>
							</div>
							<div className="rounded-xl bg-muted p-4">
								<p className="text-muted-foreground text-xs">Status</p>
								<Badge
									className="mt-2"
									variant={
										booking.status === "confirmed" ? "default" : "outline"
									}
								>
									{booking.status}
								</Badge>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<VideoIcon /> Secure room
							</CardTitle>
							<CardDescription>
								Video access will be enabled only after an authorized room
								provider is connected.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<Button className="w-full" disabled>
								Room unavailable
							</Button>
						</CardContent>
					</Card>
				</div>
			) : null}
		</div>
	);
}
