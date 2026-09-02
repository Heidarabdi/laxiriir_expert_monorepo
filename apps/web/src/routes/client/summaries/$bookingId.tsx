import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	CalendarDaysIcon,
	ClockIcon,
	FileTextIcon,
} from "lucide-react";

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
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useClientBookings } from "@/hooks/use-consultations";
import { formatDate, formatTimeRange } from "@/lib/format";

export const Route = createFileRoute("/client/summaries/$bookingId")({
	component: SummaryRoute,
	head: () => ({ meta: [{ title: "Session Summary | Laxiriir Expert" }] }),
});

function SummaryRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<SessionSummary />
			</PageShell>
		</ProtectedPage>
	);
}

function SessionSummary() {
	const { bookingId } = Route.useParams();
	const bookingsQuery = useClientBookings();
	const booking = bookingsQuery.data?.bookings.find(
		(item) => item.id === bookingId,
	);
	return (
		<div className="flex flex-col gap-6">
			<div>
				<Button asChild className="mb-4" size="sm" variant="ghost">
					<Link to="/client/bookings">
						<ArrowLeftIcon data-icon="inline-start" />
						Back to bookings
					</Link>
				</Button>
				<WorkspaceHeading
					description="Review the consultation record and available post-session material."
					eyebrow="Consultation"
					title="Session summary"
				/>
			</div>
			{bookingsQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load summary</AlertTitle>
					<AlertDescription>{bookingsQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			{bookingsQuery.isPending ? <Skeleton className="h-96" /> : null}
			{!bookingsQuery.isPending && !booking ? (
				<Alert variant="destructive">
					<AlertTitle>Booking not found</AlertTitle>
					<AlertDescription>
						This consultation is not part of your account.
					</AlertDescription>
				</Alert>
			) : null}
			{booking ? (
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.8fr)]">
					<Card>
						<CardHeader>
							<div className="flex items-center gap-4">
								<Avatar className="size-14">
									<AvatarImage
										alt={booking.expert.displayName}
										src={booking.expert.avatarUrl}
									/>
									<AvatarFallback>
										{booking.expert.displayName.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div>
									<CardTitle>{booking.expert.displayName}</CardTitle>
									<CardDescription>{booking.expert.title}</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="grid gap-4 sm:grid-cols-2">
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
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileTextIcon /> Expert notes
							</CardTitle>
							<CardDescription>
								Shared notes and takeaways will appear here when the notes
								workflow is connected.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="rounded-xl bg-muted p-4 text-muted-foreground text-sm">
								No expert summary has been shared for this session.
							</p>
						</CardContent>
					</Card>
				</div>
			) : null}
		</div>
	);
}
