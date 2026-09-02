import { createFileRoute } from "@tanstack/react-router";
import {
	BanknoteIcon,
	CircleDollarSignIcon,
	Clock3Icon,
	ReceiptTextIcon,
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
import { useExpertBookings, useExpertProfile } from "@/hooks/use-consultations";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/expert/earnings")({
	component: ExpertEarningsRoute,
	head: () => ({ meta: [{ title: "Earnings | Laxiriir Expert" }] }),
});

function ExpertEarningsRoute() {
	return (
		<ProtectedPage requireApprovedExpert roles={["expert"]}>
			<PageShell>
				<ExpertEarnings />
			</PageShell>
		</ProtectedPage>
	);
}

function ExpertEarnings() {
	const profileQuery = useExpertProfile();
	const upcomingQuery = useExpertBookings("upcoming");
	const pastQuery = useExpertBookings("past");
	const rate = profileQuery.data?.expert.hourlyRateCents ?? 0;
	const upcoming = upcomingQuery.data?.bookings ?? [];
	const history = pastQuery.data?.bookings ?? [];
	const completed = history.filter((booking) => booking.status === "confirmed");
	const cancelled = history.filter((booking) => booking.status === "cancelled");
	const error = profileQuery.error ?? upcomingQuery.error ?? pastQuery.error;
	const loading =
		profileQuery.isPending || upcomingQuery.isPending || pastQuery.isPending;
	const money = (cents: number) =>
		new Intl.NumberFormat(undefined, {
			currency: "USD",
			maximumFractionDigits: 0,
			style: "currency",
		}).format(cents / 100);
	const monthly = Array.from({ length: 6 }, (_, index) => {
		const date = new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() - 5 + index);
		const sessions = completed.filter((booking) => {
			const sessionDate = new Date(booking.startsAt);
			return (
				sessionDate.getMonth() === date.getMonth() &&
				sessionDate.getFullYear() === date.getFullYear()
			);
		}).length;
		return {
			label: date.toLocaleDateString(undefined, { month: "short" }),
			primary: (sessions * rate) / 100,
		};
	});
	const stats = [
		{
			icon: CircleDollarSignIcon,
			label: "Completed value",
			value: money(completed.length * rate),
		},
		{
			icon: Clock3Icon,
			label: "Upcoming value",
			value: money(upcoming.length * rate),
		},
		{
			icon: ReceiptTextIcon,
			label: "Completed sessions",
			value: completed.length,
		},
		{ icon: BanknoteIcon, label: "Session rate", value: money(rate) },
	];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Track the listed value of completed and upcoming consultations from booking records."
				eyebrow="Business"
				title="Earnings"
			/>
			<Alert>
				<AlertTitle>Payment settlement is not connected yet</AlertTitle>
				<AlertDescription>
					These figures use your profile rate and consultation history. They are
					marketplace value, not a payout balance.
				</AlertDescription>
			</Alert>
			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load earnings</AlertTitle>
					<AlertDescription>{error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-3xl tabular-nums">
								{loading ? <Skeleton className="h-9 w-16" /> : value}
							</CardTitle>
							<CardAction className="rounded-lg bg-accent p-3 text-accent-foreground">
								<Icon />
							</CardAction>
						</CardHeader>
					</Card>
				))}
			</div>
			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(22rem,1fr)]">
				<Card>
					<CardHeader>
						<CardTitle>Completed value trend</CardTitle>
						<CardDescription>
							Listed consultation value over the last six months.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ActivityBarChart data={monthly} primaryLabel="USD value" />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Outcome summary</CardTitle>
						<CardDescription>
							How consultation history affects listed earnings.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid grid-cols-2 gap-4">
						<div className="rounded-xl bg-muted p-4">
							<p className="text-muted-foreground text-xs">Completed</p>
							<p className="mt-1 font-semibold text-2xl">{completed.length}</p>
						</div>
						<div className="rounded-xl bg-muted p-4">
							<p className="text-muted-foreground text-xs">Cancelled</p>
							<p className="mt-1 font-semibold text-2xl">{cancelled.length}</p>
						</div>
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Consultation ledger</CardTitle>
					<CardDescription>
						Completed and cancelled sessions used in these figures.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{loading ? (
						<Skeleton className="h-64" />
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Client</TableHead>
										<TableHead>Date</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Listed value</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{history.map((booking) => (
										<TableRow key={booking.id}>
											<TableCell>
												{booking.client.displayName ?? "Client"}
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
													{booking.status === "confirmed"
														? "Completed"
														: "Cancelled"}
												</Badge>
											</TableCell>
											<TableCell className="text-right">
												{booking.status === "confirmed"
													? money(rate)
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
