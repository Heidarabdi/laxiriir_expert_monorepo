import { createFileRoute } from "@tanstack/react-router";
import {
	CalendarClockIcon,
	CircleDollarSignIcon,
	CreditCardIcon,
	ReceiptTextIcon,
} from "lucide-react";

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
import { useClientBookings } from "@/hooks/use-consultations";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/client/billing")({
	component: BillingRoute,
	head: () => ({ meta: [{ title: "Billing | Laxiriir Expert" }] }),
});

function BillingRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<ClientBilling />
			</PageShell>
		</ProtectedPage>
	);
}

function ClientBilling() {
	const bookingsQuery = useClientBookings();
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
	const money = (cents: number) =>
		new Intl.NumberFormat(undefined, {
			currency: "USD",
			maximumFractionDigits: 0,
			style: "currency",
		}).format(cents / 100);
	const bookingValue = (items: typeof bookings) =>
		items.reduce((total, booking) => total + booking.expert.hourlyRateCents, 0);
	const stats = [
		{
			icon: ReceiptTextIcon,
			label: "Completed value",
			value: money(bookingValue(completed)),
		},
		{
			icon: CalendarClockIcon,
			label: "Upcoming value",
			value: money(bookingValue(upcoming)),
		},
		{
			icon: CircleDollarSignIcon,
			label: "Total listed value",
			value: money(
				bookingValue(
					bookings.filter((booking) => booking.status === "confirmed"),
				),
			),
		},
	];
	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Review the listed value attached to your consultation history."
				eyebrow="Account"
				title="Billing"
			/>
			<Alert>
				<CreditCardIcon />
				<AlertTitle>Payment methods are not connected</AlertTitle>
				<AlertDescription>
					This ledger uses each expert's real session rate. No card has been
					charged and no invoice has been issued yet.
				</AlertDescription>
			</Alert>
			{bookingsQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load billing history</AlertTitle>
					<AlertDescription>{bookingsQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 md:grid-cols-3">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-3xl tabular-nums">
								{bookingsQuery.isPending ? (
									<Skeleton className="h-9 w-20" />
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
					<CardTitle>Consultation value history</CardTitle>
					<CardDescription>
						Booked sessions and the profile rate recorded with each expert.
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
										<TableHead>Expert</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Listed value</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{bookings.map((booking) => (
										<TableRow key={booking.id}>
											<TableCell>
												<p className="font-medium">
													{booking.expert.displayName}
												</p>
												<p className="text-muted-foreground text-xs">
													{booking.expert.title}
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
												{booking.status === "confirmed"
													? money(booking.expert.hourlyRateCents)
													: money(0)}
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
