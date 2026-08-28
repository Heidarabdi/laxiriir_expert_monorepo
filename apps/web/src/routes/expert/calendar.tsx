import type { AvailabilitySlot } from "@repo/contracts/consultations";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
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
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
import {
	useCreateAvailability,
	useDeleteAvailability,
	useOwnAvailability,
} from "@/hooks/use-consultations";
import { formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/expert/calendar")({
	component: ExpertCalendarRoute,
	head: () => ({ meta: [{ title: "Availability | Laxiriir Expert" }] }),
});

function toIso(value: string) {
	return new Date(value).toISOString();
}

function ExpertCalendarRoute() {
	return (
		<ProtectedPage requireApprovedExpert roles={["expert"]}>
			<PageShell>
				<ExpertCalendar />
			</PageShell>
		</ProtectedPage>
	);
}

function ExpertCalendar() {
	const availabilityQuery = useOwnAvailability();
	const createMutation = useCreateAvailability();
	const deleteMutation = useDeleteAvailability();
	const [startsAt, setStartsAt] = useState("");
	const [endsAt, setEndsAt] = useState("");
	const slots = availabilityQuery.data?.slots ?? [];

	async function addSlot(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!startsAt || !endsAt || new Date(endsAt) <= new Date(startsAt)) {
			toast.error("End time must be after the start time.");
			return;
		}
		try {
			await createMutation.mutateAsync({
				startsAt: toIso(startsAt),
				endsAt: toIso(endsAt),
			});
			setStartsAt("");
			setEndsAt("");
			toast.success("Availability added.");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to add availability.",
			);
		}
	}

	async function removeSlot(slot: AvailabilitySlot) {
		try {
			await deleteMutation.mutateAsync(slot.id);
			toast.success("Availability removed.");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to remove availability.",
			);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="These are the exact time slots clients see and book."
				eyebrow="Expert workspace"
				title="Availability"
			/>
			<Card>
				<CardHeader>
					<CardTitle>Add a time slot</CardTitle>
					<CardDescription>
						Times use your device timezone and are stored safely as UTC.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={addSlot}>
						<FieldGroup>
							<div className="grid gap-4 sm:grid-cols-2">
								<Field>
									<FieldLabel htmlFor="starts-at">Starts</FieldLabel>
									<Input
										id="starts-at"
										onChange={(event) => setStartsAt(event.target.value)}
										required
										type="datetime-local"
										value={startsAt}
									/>
								</Field>
								<Field>
									<FieldLabel htmlFor="ends-at">Ends</FieldLabel>
									<Input
										id="ends-at"
										onChange={(event) => setEndsAt(event.target.value)}
										required
										type="datetime-local"
										value={endsAt}
									/>
								</Field>
							</div>
							<FieldDescription>
								Overlapping or past slots are rejected by the server.
							</FieldDescription>
							<Button disabled={createMutation.isPending} type="submit">
								<CalendarPlusIcon data-icon="inline-start" />
								{createMutation.isPending ? "Adding…" : "Add availability"}
							</Button>
						</FieldGroup>
					</form>
				</CardContent>
			</Card>
			{availabilityQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load availability</AlertTitle>
					<AlertDescription>{availabilityQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<Card>
				<CardHeader>
					<CardTitle>Your slots</CardTitle>
					<CardDescription>
						{slots.length} total availability slots.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{availabilityQuery.isPending ? (
						<Skeleton className="h-48" />
					) : (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Date</TableHead>
									<TableHead>Time</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{slots.map((slot) => (
									<TableRow key={slot.id}>
										<TableCell>{formatDate(slot.startsAt)}</TableCell>
										<TableCell>
											{formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
										</TableCell>
										<TableCell>
											<Badge variant={slot.booked ? "default" : "secondary"}>
												{slot.booked ? "Booked" : "Open"}
											</Badge>
										</TableCell>
										<TableCell className="text-right">
											{slot.booked ? (
												<span className="text-muted-foreground text-xs">
													Reserved
												</span>
											) : (
												<AlertDialog>
													<AlertDialogTrigger asChild>
														<Button size="icon-sm" variant="ghost">
															<Trash2Icon />
															<span className="sr-only">Delete slot</span>
														</Button>
													</AlertDialogTrigger>
													<AlertDialogContent>
														<AlertDialogHeader>
															<AlertDialogTitle>
																Delete this availability?
															</AlertDialogTitle>
															<AlertDialogDescription>
																Clients will no longer be able to book this
																time.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Keep slot</AlertDialogCancel>
															<AlertDialogAction
																onClick={() => void removeSlot(slot)}
															>
																Delete
															</AlertDialogAction>
														</AlertDialogFooter>
													</AlertDialogContent>
												</AlertDialog>
											)}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
					{!availabilityQuery.isPending && slots.length === 0 ? (
						<p className="py-8 text-center text-muted-foreground text-sm">
							No availability created yet.
						</p>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
