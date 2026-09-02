import type { AvailabilitySlot } from "@repo/contracts/consultations";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
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
	useUpdateAvailability,
} from "@/hooks/use-consultations";
import { formatDate, formatTime } from "@/lib/format";

export const Route = createFileRoute("/expert/calendar")({
	component: ExpertCalendarRoute,
	head: () => ({ meta: [{ title: "Availability | Laxiriir Expert" }] }),
});

function toIso(value: string) {
	return new Date(value).toISOString();
}

function toLocalInputValue(value: string) {
	const date = new Date(value);
	const localDate = new Date(
		date.getTime() - date.getTimezoneOffset() * 60_000,
	);
	return localDate.toISOString().slice(0, 16);
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
	const updateMutation = useUpdateAvailability();
	const deleteMutation = useDeleteAvailability();
	const [startsAt, setStartsAt] = useState("");
	const [endsAt, setEndsAt] = useState("");
	const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const slots = availabilityQuery.data?.slots ?? [];
	const isSaving = createMutation.isPending || updateMutation.isPending;

	function resetForm() {
		setEditingSlot(null);
		setStartsAt("");
		setEndsAt("");
	}

	function addSlot() {
		resetForm();
		setDialogOpen(true);
	}

	function editSlot(slot: AvailabilitySlot) {
		setEditingSlot(slot);
		setStartsAt(toLocalInputValue(slot.startsAt));
		setEndsAt(toLocalInputValue(slot.endsAt));
		setDialogOpen(true);
	}

	async function saveSlot(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!startsAt || !endsAt || new Date(endsAt) <= new Date(startsAt)) {
			toast.error("End time must be after the start time.");
			return;
		}
		try {
			const input = { startsAt: toIso(startsAt), endsAt: toIso(endsAt) };
			if (editingSlot) {
				await updateMutation.mutateAsync({ input, slotId: editingSlot.id });
				toast.success("Availability updated.");
			} else {
				await createMutation.mutateAsync(input);
				toast.success("Availability added.");
			}
			resetForm();
			setDialogOpen(false);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to save availability.",
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
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<WorkspaceHeading
					description="Create and manage the exact time slots clients can reserve."
					eyebrow="Expert workspace"
					title="Availability"
				/>
				<Button onClick={addSlot}>
					<CalendarPlusIcon data-icon="inline-start" />
					Add availability
				</Button>
			</div>
			<Dialog
				onOpenChange={(open) => {
					setDialogOpen(open);
					if (!open) resetForm();
				}}
				open={dialogOpen}
			>
				<DialogContent className="sm:max-w-xl">
					<DialogHeader>
						<DialogTitle>
							{editingSlot ? "Edit availability" : "Add availability"}
						</DialogTitle>
						<DialogDescription>
							Times use your device timezone. Overlapping or past slots are
							rejected by the server.
						</DialogDescription>
					</DialogHeader>
					<form className="flex flex-col gap-6" onSubmit={saveSlot}>
						<FieldGroup className="grid sm:grid-cols-2">
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
						</FieldGroup>
						<FieldDescription>
							Clients will immediately see an open slot after it is saved.
						</FieldDescription>
						<DialogFooter>
							<Button
								onClick={() => setDialogOpen(false)}
								type="button"
								variant="outline"
							>
								Cancel
							</Button>
							<Button disabled={isSaving} type="submit">
								{isSaving
									? "Saving…"
									: editingSlot
										? "Save changes"
										: "Add slot"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
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
					{availabilityQuery.isPending ? <Skeleton className="h-48" /> : null}
					{!availabilityQuery.isPending && slots.length > 0 ? (
						<div className="overflow-x-auto">
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
											<TableCell>
												{slot.booked ? (
													<span className="text-muted-foreground text-xs">
														Reserved
													</span>
												) : (
													<div className="flex justify-end gap-1">
														<Button
															onClick={() => editSlot(slot)}
															size="icon-sm"
															variant="ghost"
														>
															<PencilIcon />
															<span className="sr-only">Edit slot</span>
														</Button>
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
																	<AlertDialogCancel>
																		Keep slot
																	</AlertDialogCancel>
																	<AlertDialogAction
																		onClick={() => void removeSlot(slot)}
																	>
																		Delete
																	</AlertDialogAction>
																</AlertDialogFooter>
															</AlertDialogContent>
														</AlertDialog>
													</div>
												)}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					) : null}
					{!availabilityQuery.isPending && slots.length === 0 ? (
						<Empty className="min-h-56 border">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<CalendarPlusIcon />
								</EmptyMedia>
								<EmptyTitle>No availability yet</EmptyTitle>
								<EmptyDescription>
									Add your first open time above so clients can book you.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
