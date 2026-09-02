import { createFileRoute } from "@tanstack/react-router";
import {
	BanknoteIcon,
	CalendarClockIcon,
	CircleDollarSignIcon,
	RotateCcwIcon,
} from "lucide-react";

import { ActivityBarChart } from "@/components/dashboard-charts";
import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/finance")({
	component: AdminFinanceRoute,
	head: () => ({ meta: [{ title: "Finance | Laxiriir Expert" }] }),
});

const money = (cents: number) =>
	new Intl.NumberFormat(undefined, {
		currency: "USD",
		maximumFractionDigits: 0,
		style: "currency",
	}).format(cents / 100);

function AdminFinanceRoute() {
	return (
		<ProtectedPage roles={["admin"]}>
			<PageShell>
				<AdminFinance />
			</PageShell>
		</ProtectedPage>
	);
}

function AdminFinance() {
	const bookingsQuery = useAdminBookings();
	const bookings = bookingsQuery.data?.bookings ?? [];
	const now = new Date();
	const completed = bookings.filter(
		(booking) =>
			booking.status === "confirmed" && new Date(booking.endsAt) <= now,
	);
	const upcoming = bookings.filter(
		(booking) =>
			booking.status === "confirmed" && new Date(booking.startsAt) > now,
	);
	const cancelled = bookings.filter(
		(booking) => booking.status === "cancelled",
	);
	const bookingValue = (items: typeof bookings) =>
		items.reduce((total, booking) => total + booking.expert.hourlyRateCents, 0);
	const monthly = Array.from({ length: 6 }, (_, index) => {
		const date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - 5 + index);
		const items = completed.filter((booking) => {
			const session = new Date(booking.startsAt);
			return (
				session.getMonth() === date.getMonth() &&
				session.getFullYear() === date.getFullYear()
			);
		});
		return {
			label: date.toLocaleDateString(undefined, { month: "short" }),
			primary: bookingValue(items) / 100,
		};
	});
	const stats = [
		{
			icon: CircleDollarSignIcon,
			label: "Completed value",
			value: money(bookingValue(completed)),
		},
		{
			icon: CalendarClockIcon,
			label: "Upcoming value",
			value: money(bookingValue(upcoming)),
		},
		{
			icon: RotateCcwIcon,
			label: "Cancelled value",
			value: money(bookingValue(cancelled)),
		},
		{ icon: BanknoteIcon, label: "Settled payouts", value: "Not connected" },
	];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Review marketplace value from booking records and prepare for payment settlement."
				eyebrow="Operations"
				title="Finance"
			/>
			<Alert>
				<AlertTitle>Payment processing is not connected</AlertTitle>
				<AlertDescription>
					Booking values below are real profile rates, but they do not represent
					captured payments, fees, refunds, or expert payouts.
				</AlertDescription>
			</Alert>
			{bookingsQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load finance data</AlertTitle>
					<AlertDescription>{bookingsQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-2xl tabular-nums">
								{bookingsQuery.isPending ? (
									<Skeleton className="h-8 w-20" />
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
					<CardTitle>Completed booking value</CardTitle>
					<CardDescription>
						Listed session value over the last six months.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ActivityBarChart data={monthly} primaryLabel="USD value" />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle>Value ledger</CardTitle>
					<CardDescription>
						Every booking and the expert rate attached to it.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{bookingsQuery.isPending ? (
						<Skeleton className="h-64" />
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Booking</TableHead>
										<TableHead>Participants</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Listed value</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{bookings.map((booking) => (
										<TableRow key={booking.id}>
											<TableCell className="font-mono text-xs">
												{booking.id.slice(0, 8)}
											</TableCell>
											<TableCell>
												<p>{booking.client.displayName}</p>
												<p className="text-muted-foreground text-xs">
													with {booking.expert.displayName}
												</p>
											</TableCell>
											<TableCell>{formatDate(booking.startsAt)}</TableCell>
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
											<TableCell className="text-right">
												{money(booking.expert.hourlyRateCents)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
