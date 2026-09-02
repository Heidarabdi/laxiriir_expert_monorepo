import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, CalendarDaysIcon, CheckIcon } from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WorkspaceHeading } from "@/components/workspace-heading";
import {
	useCreateBooking,
	useExpertAvailability,
	useExperts,
} from "@/hooks/use-consultations";
import {
	formatDate,
	formatPrice,
	formatTimeRange,
	messageFrom,
} from "@/lib/format";

export const Route = createFileRoute("/client/bookings/new/$expertId")({
	component: NewBookingRoute,
	head: () => ({ meta: [{ title: "Book a Session | Laxiriir Expert" }] }),
});

function NewBookingRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<NewBookingPage />
			</PageShell>
		</ProtectedPage>
	);
}

function NewBookingPage() {
	const { expertId } = Route.useParams();
	const navigate = useNavigate();
	const expertsQuery = useExperts();
	const availabilityQuery = useExpertAvailability(expertId);
	const bookingMutation = useCreateBooking();
	const [selectedSlotId, setSelectedSlotId] = useState("");
	const expert = expertsQuery.data?.experts.find(
		(item) => item.id === expertId,
	);
	const slots = availabilityQuery.data?.slots ?? [];
	const error =
		expertsQuery.error ?? availabilityQuery.error ?? bookingMutation.error;

	async function confirmBooking() {
		if (!selectedSlotId) return;
		const response = await bookingMutation.mutateAsync({
			availabilitySlotId: Number(selectedSlotId),
		});
		await navigate({
			params: { bookingId: response.booking.id },
			to: "/client/bookings/$bookingId",
		});
	}

	if (expertsQuery.isPending) {
		return <Skeleton className="min-h-96" />;
	}

	if (!expert) {
		return (
			<Empty className="min-h-96 border bg-card">
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<CalendarDaysIcon />
					</EmptyMedia>
					<EmptyTitle>Expert not found</EmptyTitle>
					<EmptyDescription>
						This expert is no longer available for booking.
					</EmptyDescription>
				</EmptyHeader>
				<EmptyContent>
					<Button asChild variant="outline">
						<Link to="/client/experts">Browse experts</Link>
					</Button>
				</EmptyContent>
			</Empty>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<Button asChild className="w-fit" variant="ghost">
				<Link to="/client/experts">
					<ArrowLeftIcon data-icon="inline-start" />
					Back to experts
				</Link>
			</Button>
			<WorkspaceHeading
				description="Choose an available time and confirm the session details."
				eyebrow="New booking"
				title={`Book ${expert.displayName}`}
			/>
			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to create this booking</AlertTitle>
					<AlertDescription>
						{messageFrom(error, "Please try again.")}
					</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
				<Card>
					<CardHeader>
						<div className="flex items-center gap-4">
							<Avatar size="lg">
								<AvatarImage alt={expert.displayName} src={expert.avatarUrl} />
								<AvatarFallback>
									{expert.displayName.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0">
								<CardTitle className="truncate">{expert.displayName}</CardTitle>
								<CardDescription>{expert.title}</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						<Badge className="w-fit" variant="secondary">
							{expert.category}
						</Badge>
						<p className="text-pretty text-muted-foreground">{expert.bio}</p>
						<div>
							<p className="font-semibold text-lg">
								{formatPrice(expert.hourlyRateCents)}
							</p>
							<p className="text-muted-foreground text-sm">per session</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Available times</CardTitle>
						<CardDescription>
							Times are shown in your local timezone.
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						{availabilityQuery.isPending ? (
							<div className="flex flex-col gap-3">
								<Skeleton className="h-11" />
								<Skeleton className="h-11" />
							</div>
						) : null}
						{!availabilityQuery.isPending && slots.length === 0 ? (
							<Empty>
								<EmptyHeader>
									<EmptyMedia variant="icon">
										<CalendarDaysIcon />
									</EmptyMedia>
									<EmptyTitle>No open times</EmptyTitle>
									<EmptyDescription>
										This expert has not published upcoming availability.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						) : null}
						{slots.length > 0 ? (
							<ToggleGroup
								className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1"
								onValueChange={setSelectedSlotId}
								type="single"
								value={selectedSlotId}
								variant="outline"
							>
								{slots.map((slot) => (
									<ToggleGroupItem
										className="h-auto justify-start py-3 text-left"
										key={slot.id}
										value={String(slot.id)}
									>
										<CalendarDaysIcon />
										<span className="flex flex-col items-start">
											<span>{formatDate(slot.startsAt, "full")}</span>
											<span className="font-normal text-xs opacity-80">
												{formatTimeRange(slot.startsAt, slot.endsAt)}
											</span>
										</span>
									</ToggleGroupItem>
								))}
							</ToggleGroup>
						) : null}
						<Button
							disabled={!selectedSlotId || bookingMutation.isPending}
							onClick={() => void confirmBooking()}
						>
							{bookingMutation.isPending ? (
								<Spinner data-icon="inline-start" />
							) : (
								<CheckIcon data-icon="inline-start" />
							)}
							Confirm booking
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
