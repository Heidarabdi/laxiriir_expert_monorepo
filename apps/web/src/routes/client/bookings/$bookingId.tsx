import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	CalendarDaysIcon,
	CreditCardIcon,
	RefreshCwIcon,
	XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useCancelBooking, useClientBookings } from "@/hooks/use-consultations";
import {
	formatDate,
	formatPrice,
	formatTimeRange,
	messageFrom,
} from "@/lib/format";

export const Route = createFileRoute("/client/bookings/$bookingId")({
	component: BookingDetailRoute,
	head: () => ({ meta: [{ title: "Session Details | Laxiriir Expert" }] }),
});

function BookingDetailRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<BookingDetailPage />
			</PageShell>
		</ProtectedPage>
	);
}

function BookingDetailPage() {
	const { bookingId } = Route.useParams();
	const navigate = useNavigate();
	const bookingsQuery = useClientBookings();
	const cancelMutation = useCancelBooking();
	const booking = bookingsQuery.data?.bookings.find(
		(item) => item.id === bookingId,
	);
	const error = bookingsQuery.error ?? cancelMutation.error;

	async function cancelBooking() {
		await cancelMutation.mutateAsync(bookingId);
		toast.success("Your session was cancelled.");
		await navigate({ to: "/client/bookings" });
	}

	if (bookingsQuery.isPending) {
		return <Skeleton className="min-h-96" />;
	}

	if (!booking) {
		return (
			<Empty className="min-h-96 border bg-card">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<CalendarDaysIcon />
					</EmptyMedia>
					<EmptyTitle>Session not found</EmptyTitle>
					<EmptyDescription>
						This booking does not exist or no longer belongs to your account.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button asChild variant="outline">
						<Link to="/client/bookings">Return to sessions</Link>
					</Button>
				</EmptyContent>
			</Empty>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<Button asChild className="w-fit" variant="ghost">
				<Link to="/client/bookings">
					<ArrowLeftIcon data-icon="inline-start" />
					Back to sessions
				</Link>
			</Button>
			<WorkspaceHeading
				description="Review the schedule, expert, and current booking status."
				eyebrow="Session details"
				title={formatDate(booking.startsAt, "full")}
			/>
			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to update this session</AlertTitle>
					<AlertDescription>
						{messageFrom(error, "Please try again.")}
					</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-4">
							<Avatar size="lg">
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
						<CardAction>
							<Badge
								variant={
									booking.status === "confirmed" ? "default" : "secondary"
								}
							>
								{booking.status}
							</Badge>
						</CardAction>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						<div className="grid gap-4 sm:grid-cols-2">
							<div>
								<p className="text-muted-foreground text-sm">Date</p>
								<p className="font-medium">
									{formatDate(booking.startsAt, "full")}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Time</p>
								<p className="font-medium">
									{formatTimeRange(booking.startsAt, booking.endsAt)}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Session fee</p>
								<p className="font-medium">
									{formatPrice(booking.expert.hourlyRateCents)}
								</p>
							</div>
							<div>
								<p className="text-muted-foreground text-sm">Booked</p>
								<p className="font-medium">{formatDate(booking.createdAt)}</p>
							</div>
						</div>
						<Separator />
						<div className="flex flex-wrap gap-3">
							<Button asChild variant="outline">
								<Link params={{ id: booking.expert.id }} to="/experts/$id">
									View expert profile
								</Link>
							</Button>
							{booking.status === "confirmed" ? (
								<Button asChild variant="outline">
									<Link to="/client/bookings">
										<RefreshCwIcon data-icon="inline-start" />
										Reschedule
									</Link>
								</Button>
							) : null}
							{booking.status === "confirmed" ? (
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<Button variant="destructive">
											<XIcon data-icon="inline-start" />
											Cancel session
										</Button>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Cancel this session?</AlertDialogTitle>
											<AlertDialogDescription>
												The time becomes available to other clients. This cannot
												be undone.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Keep session</AlertDialogCancel>
											<AlertDialogAction
												disabled={cancelMutation.isPending}
												onClick={() => void cancelBooking()}
												variant="destructive"
											>
												{cancelMutation.isPending ? (
													<Spinner data-icon="inline-start" />
												) : null}
												Cancel session
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							) : null}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Payment</CardTitle>
						<CardDescription>Payment status for this session.</CardDescription>
					</CardHeader>
					<CardContent>
						<Alert>
							<CreditCardIcon />
							<AlertTitle>Payments are not enabled yet</AlertTitle>
							<AlertDescription>
								No charge has been created for this booking.
							</AlertDescription>
						</Alert>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
