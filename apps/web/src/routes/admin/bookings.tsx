import type { AdminBookingDetail } from "@repo/contracts/consultations";
import { createFileRoute } from "@tanstack/react-router";
import {
	CalendarCheckIcon,
	CalendarClockIcon,
	CircleDollarSignIcon,
	SearchIcon,
	XCircleIcon,
} from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useAdminBookings } from "@/hooks/use-consultations";
import { formatDate, formatTimeRange } from "@/lib/format";

export const Route = createFileRoute("/admin/bookings")({
	component: AdminBookingsRoute,
	head: () => ({ meta: [{ title: "Admin Bookings | Laxiriir Expert" }] }),
});

function AdminBookingsRoute() {
	return (
		<ProtectedPage roles={["admin"]}>
			<PageShell>
				<AdminBookings />
			</PageShell>
		</ProtectedPage>
	);
}

function AdminBookings() {
	const bookingsQuery = useAdminBookings();
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState("all");
	const [selected, setSelected] = useState<AdminBookingDetail | null>(null);
	const bookings = bookingsQuery.data?.bookings ?? [];
	const now = new Date();
	const confirmed = bookings.filter(
		(booking) => booking.status === "confirmed",
	);
	const upcoming = confirmed.filter(
		(booking) => new Date(booking.startsAt) > now,
	);
	const completed = confirmed.filter(
		(booking) => new Date(booking.endsAt) <= now,
	);
	const cancelled = bookings.filter(
		(booking) => booking.status === "cancelled",
	);
	const completedValue = completed.reduce(
		(total, booking) => total + booking.expert.hourlyRateCents,
		0,
	);
	const filtered = bookings.filter((booking) => {
		const haystack =
			`${booking.client.displayName} ${booking.client.email} ${booking.expert.displayName}`.toLowerCase();
		return (
			haystack.includes(search.toLowerCase()) &&
			(status === "all" || booking.status === status)
		);
	});
	const stats = [
		{ icon: CalendarCheckIcon, label: "All bookings", value: bookings.length },
		{ icon: CalendarClockIcon, label: "Upcoming", value: upcoming.length },
		{ icon: XCircleIcon, label: "Cancelled", value: cancelled.length },
		{
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
				description="Inspect consultation state, participants, timing, and marketplace value."
				eyebrow="Operations"
				title="Bookings"
			/>
			{bookingsQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load bookings</AlertTitle>
					<AlertDescription>{bookingsQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-3xl tabular-nums">
								{bookingsQuery.isPending ? (
									<Skeleton className="h-9 w-14" />
								) : (
									value
								)}
							</CardTitle>
							<CardAction className="rounded-lg bg-accent p-3 text-accent-foreground">
								<Icon />
							</CardAction>
						</CardHeader>
					</Card>
				))}
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Booking ledger</CardTitle>
					<CardDescription>
						{filtered.length} bookings match the current filters.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<div className="flex flex-col gap-3 sm:flex-row">
						<div className="relative flex-1">
							<SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								className="pl-9"
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Search client or expert…"
								value={search}
							/>
						</div>
						<Select onValueChange={setStatus} value={status}>
							<SelectTrigger className="w-full sm:w-44">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All statuses</SelectItem>
								<SelectItem value="confirmed">Confirmed</SelectItem>
								<SelectItem value="cancelled">Cancelled</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{bookingsQuery.isPending ? (
						<Skeleton className="h-72" />
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Client</TableHead>
										<TableHead>Expert</TableHead>
										<TableHead>Session</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Value</TableHead>
										<TableHead className="text-right">Action</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filtered.map((booking) => (
										<TableRow key={booking.id}>
											<TableCell>
												<p className="font-medium">
													{booking.client.displayName}
												</p>
												<p className="text-muted-foreground text-xs">
													{booking.client.email}
												</p>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<Avatar className="size-8">
														<AvatarImage
															alt={booking.expert.displayName}
															src={booking.expert.avatarUrl}
														/>
														<AvatarFallback>
															{booking.expert.displayName.slice(0, 2)}
														</AvatarFallback>
													</Avatar>
													<span>{booking.expert.displayName}</span>
												</div>
											</TableCell>
											<TableCell>
												<p>{formatDate(booking.startsAt)}</p>
												<p className="text-muted-foreground text-xs">
													{formatTimeRange(booking.startsAt, booking.endsAt)}
												</p>
											</TableCell>
											<TableCell>
												<Badge
													variant={
														booking.status === "confirmed"
															? "default"
															: "outline"
													}
												>
													{booking.status}
												</Badge>
											</TableCell>
											<TableCell>
												${booking.expert.hourlyRateCents / 100}
											</TableCell>
											<TableCell className="text-right">
												<Button
													onClick={() => setSelected(booking)}
													size="sm"
													variant="outline"
												>
													Inspect
												</Button>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
			<Dialog
				onOpenChange={(open) => {
					if (!open) setSelected(null);
				}}
				open={Boolean(selected)}
			>
				<DialogContent className="sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>Booking details</DialogTitle>
						<DialogDescription>
							Operational view of the selected consultation.
						</DialogDescription>
					</DialogHeader>
					{selected ? (
						<div className="grid gap-4 sm:grid-cols-2">
							<div className="rounded-xl bg-muted p-4">
								<p className="text-muted-foreground text-xs">Client</p>
								<p className="mt-1 font-medium">
									{selected.client.displayName}
								</p>
								<p className="text-muted-foreground text-sm">
									{selected.client.email}
								</p>
							</div>
							<div className="rounded-xl bg-muted p-4">
								<p className="text-muted-foreground text-xs">Expert</p>
								<p className="mt-1 font-medium">
									{selected.expert.displayName}
								</p>
								<p className="text-muted-foreground text-sm">
									{selected.expert.title}
								</p>
							</div>
							<div className="rounded-xl bg-muted p-4">
								<p className="text-muted-foreground text-xs">Scheduled</p>
								<p className="mt-1 font-medium">
									{formatDate(selected.startsAt, "full")}
								</p>
								<p className="text-muted-foreground text-sm">
									{formatTimeRange(selected.startsAt, selected.endsAt)}
								</p>
							</div>
							<div className="rounded-xl bg-muted p-4">
								<p className="text-muted-foreground text-xs">Booking ID</p>
								<p className="mt-1 break-all font-mono text-sm">
									{selected.id}
								</p>
							</div>
						</div>
					) : null}
				</DialogContent>
			</Dialog>
		</div>
	);
}
