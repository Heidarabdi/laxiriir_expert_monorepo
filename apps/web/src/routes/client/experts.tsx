import type { ExpertSummary } from "@repo/contracts/consultations";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarDaysIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";

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
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { WorkspaceHeading } from "@/components/workspace-heading";
import {
	useCreateBooking,
	useExpertAvailability,
	useExperts,
} from "@/hooks/use-consultations";
import { formatPrice, formatTimeRange, messageFrom } from "@/lib/format";

export const Route = createFileRoute("/client/experts")({
	component: ClientExpertsRoute,
	head: () => ({ meta: [{ title: "Experts | Laxiriir Expert" }] }),
});

function ClientExpertsRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<ClientExperts />
			</PageShell>
		</ProtectedPage>
	);
}

function ClientExperts() {
	const navigate = useNavigate();
	const expertsQuery = useExperts();
	const [category, setCategory] = useState("All");
	const [selected, setSelected] = useState<ExpertSummary | null>(null);
	const availabilityQuery = useExpertAvailability(selected?.id ?? null);
	const bookingMutation = useCreateBooking();
	const experts = expertsQuery.data?.experts ?? [];
	const categories = useMemo(
		() => ["All", ...new Set(experts.map((expert) => expert.category))],
		[experts],
	);
	const filtered =
		category === "All"
			? experts
			: experts.filter((expert) => expert.category === category);
	const error =
		expertsQuery.error ?? availabilityQuery.error ?? bookingMutation.error;

	async function bookSlot(availabilitySlotId: number) {
		await bookingMutation.mutateAsync({ availabilitySlotId });
		await navigate({ to: "/client/sessions" });
	}

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Review verified expert profiles and reserve a real open time slot."
				eyebrow="Expert directory"
				title="Find your next expert"
			/>
			{error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to complete that request</AlertTitle>
					<AlertDescription>
						{messageFrom(error, "Please try again.")}
					</AlertDescription>
				</Alert>
			) : null}
			<ToggleGroup
				onValueChange={(value) => value && setCategory(value)}
				type="single"
				value={category}
				variant="outline"
			>
				{categories.map((item) => (
					<ToggleGroupItem key={item} value={item}>
						{item}
					</ToggleGroupItem>
				))}
			</ToggleGroup>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{expertsQuery.isPending
					? [1, 2, 3].map((item) => <Skeleton className="h-72" key={item} />)
					: null}
				{filtered.map((expert) => (
					<Card key={expert.id}>
						<CardHeader>
							<div className="flex items-center gap-3">
								<Avatar size="lg">
									<AvatarImage
										alt={expert.displayName}
										src={expert.avatarUrl}
									/>
									<AvatarFallback>
										{expert.displayName.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0">
									<CardTitle className="truncate">
										{expert.displayName}
									</CardTitle>
									<CardDescription>{expert.title}</CardDescription>
								</div>
							</div>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							<Badge className="w-fit" variant="secondary">
								{expert.category}
							</Badge>
							<p className="line-clamp-3 text-muted-foreground text-sm">
								{expert.bio}
							</p>
						</CardContent>
						<CardFooter className="justify-between">
							<div>
								<p className="font-semibold text-primary">
									{formatPrice(expert.hourlyRateCents)}
								</p>
								<p className="text-muted-foreground text-xs">per session</p>
							</div>
							<Button
								onClick={() => setSelected(expert)}
								variant={selected?.id === expert.id ? "secondary" : "default"}
							>
								View times
							</Button>
						</CardFooter>
					</Card>
				))}
			</div>
			{selected ? (
				<Card>
					<CardHeader>
						<CardTitle>{selected.displayName}&apos;s availability</CardTitle>
						<CardDescription>
							Times are displayed in your local timezone.
						</CardDescription>
					</CardHeader>
					<CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						{availabilityQuery.isPending ? (
							<>
								<Skeleton className="h-20" />
								<Skeleton className="h-20" />
							</>
						) : null}
						{!availabilityQuery.isPending &&
						availabilityQuery.data?.slots.length === 0 ? (
							<Empty className="sm:col-span-2 lg:col-span-3">
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
						{availabilityQuery.data?.slots.map((slot) => (
							<Button
								className="h-auto justify-start py-4"
								disabled={bookingMutation.isPending}
								key={slot.id}
								onClick={() => void bookSlot(slot.id)}
								variant="outline"
							>
								<CalendarDaysIcon data-icon="inline-start" />
								<span className="flex flex-col items-start">
									<span>{new Date(slot.startsAt).toLocaleDateString()}</span>
									<span className="text-muted-foreground text-xs">
										{formatTimeRange(slot.startsAt, slot.endsAt)}
									</span>
								</span>
							</Button>
						))}
					</CardContent>
				</Card>
			) : (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SearchIcon />
						</EmptyMedia>
						<EmptyTitle>Select an expert</EmptyTitle>
						<EmptyDescription>
							Choose “View times” to see current availability.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			)}
		</div>
	);
}
