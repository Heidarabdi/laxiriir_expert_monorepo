import type { BookingDetail } from "@repo/contracts/consultations";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDaysIcon, RefreshCwIcon, XIcon } from "lucide-react";
import { useState } from "react";

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
	CardContent,
	CardDescription,
	CardFooter,
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
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkspaceHeading } from "@/components/workspace-heading";
import {
	useCancelBooking,
	useClientBookings,
	useExpertAvailability,
	useRescheduleBooking,
} from "@/hooks/use-consultations";
import {
	canChangeBooking,
	formatDate,
	formatTimeRange,
	messageFrom,
} from "@/lib/format";

export const Route = createFileRoute("/client/sessions")({
	component: ClientSessionsRoute,
	head: () => ({ meta: [{ title: "My Sessions | Laxiriir Expert" }] }),
});

function ClientSessionsRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<ClientSessions />
			</PageShell>
		</ProtectedPage>
	);
}

function ClientSessions() {
	const bookingsQuery = useClientBookings();
	const cancelMutation = useCancelBooking();
	const rescheduleMutation = useRescheduleBooking();
	const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");
	const [rescheduling, setRescheduling] = useState<BookingDetail | null>(null);
	const availabilityQuery = useExpertAvailability(
		rescheduling?.expert.id ?? null,
	);
	const bookings = bookingsQuery.data?.bookings ?? [];
	const now = Date.now();
	const filtered = bookings.filter((booking) => {
		if (filter === "upcoming")
			return (
				booking.status === "confirmed" &&
				new Date(booking.startsAt).getTime() > now
			);
		if (filter === "past")
			return (
				booking.status === "cancelled" ||
				new Date(booking.endsAt).getTime() <= now
			);
		return true;
	});
	const error =
		bookingsQuery.error ??
		cancelMutation.error ??
		rescheduleMutation.error ??
		availabilityQuery.error;

	async function chooseReplacement(availabilitySlotId: number) {
		if (!rescheduling) return;
		await rescheduleMutation.mutateAsync({
			bookingId: rescheduling.id,
			input: { availabilitySlotId },
		});
		setRescheduling(null);
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<WorkspaceHeading
					description="Review, reschedule, or cancel your saved sessions."
					eyebrow="Consultations"
					title="My sessions"
				/>
				<Button asChild>
					<Link to="/client/experts">Book a session</Link>
				</Button>
			</div>
			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to update your sessions</AlertTitle>
					<AlertDescription>
						{messageFrom(error, "Please try again.")}
					</AlertDescription>
				</Alert>
			) : null}
			<Tabs
				onValueChange={(value) => setFilter(value as typeof filter)}
				value={filter}
			>
				<TabsList>
					<TabsTrigger value="all">All</TabsTrigger>
					<TabsTrigger value="upcoming">Upcoming</TabsTrigger>
					<TabsTrigger value="past">Past</TabsTrigger>
				</TabsList>
			</Tabs>
			{bookingsQuery.isPending ? (
				<>
					<Skeleton className="h-44" />
					<Skeleton className="h-44" />
				</>
			) : null}
			{!bookingsQuery.isPending && filtered.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<CalendarDaysIcon />
						</EmptyMedia>
						<EmptyTitle>No sessions found</EmptyTitle>
						<EmptyDescription>
							Book an available expert and the session will appear here.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button asChild>
							<Link to="/client/experts">Browse experts</Link>
						</Button>
					</EmptyContent>
				</Empty>
			) : null}
			<div className="grid gap-4">
				{filtered.map((booking) => {
					const changeable = canChangeBooking(booking.startsAt, booking.status);
					return (
						<Card key={booking.id}>
							<CardHeader className="flex-row items-start justify-between">
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
										<CardTitle>{booking.expert.displayName}</CardTitle>
										<CardDescription>{booking.expert.title}</CardDescription>
									</div>
								</div>
								<Badge
									variant={
										booking.status === "confirmed" ? "default" : "secondary"
									}
								>
									{booking.status}
								</Badge>
							</CardHeader>
							<CardContent>
								<p className="font-medium">
									{formatDate(booking.startsAt, "full")}
								</p>
								<p className="text-muted-foreground text-sm">
									{formatTimeRange(booking.startsAt, booking.endsAt)}
								</p>
							</CardContent>
							{changeable ? (
								<CardFooter className="gap-2">
									<Button
										onClick={() =>
											setRescheduling(
												rescheduling?.id === booking.id ? null : booking,
											)
										}
										variant="outline"
									>
										<RefreshCwIcon data-icon="inline-start" />
										{rescheduling?.id === booking.id
											? "Close times"
											: "Reschedule"}
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="destructive">
												<XIcon data-icon="inline-start" />
												Cancel
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													Cancel this session?
												</AlertDialogTitle>
												<AlertDialogDescription>
													The time becomes available to other clients. This
													cannot be undone.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Keep session</AlertDialogCancel>
												<AlertDialogAction
													disabled={cancelMutation.isPending}
													onClick={() =>
														void cancelMutation.mutateAsync(booking.id)
													}
													variant="destructive"
												>
													Cancel session
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</CardFooter>
							) : null}
							{rescheduling?.id === booking.id ? (
								<CardContent className="border-t pt-4">
									<p className="mb-3 font-medium text-sm">
										Choose a replacement time
									</p>
									<div className="grid gap-2 sm:grid-cols-2">
										{availabilityQuery.isPending ? <Spinner /> : null}
										{availabilityQuery.data?.slots
											.filter(
												(slot) =>
													new Date(slot.startsAt).getTime() - now >=
													24 * 60 * 60 * 1000,
											)
											.map((slot) => (
												<Button
													disabled={rescheduleMutation.isPending}
													key={slot.id}
													onClick={() => void chooseReplacement(slot.id)}
													variant="outline"
												>
													{formatDate(slot.startsAt)} ·{" "}
													{formatTimeRange(slot.startsAt, slot.endsAt)}
												</Button>
											))}
									</div>
								</CardContent>
							) : null}
						</Card>
					);
				})}
			</div>
		</div>
	);
}
