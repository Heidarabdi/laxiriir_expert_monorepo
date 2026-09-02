import { createFileRoute, Link } from "@tanstack/react-router";
import { BookmarkCheckIcon, BookmarkIcon, SearchIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useExperts } from "@/hooks/use-consultations";
import {
	useRemoveSavedExpert,
	useSavedExperts,
	useSaveExpert,
} from "@/hooks/use-engagements";
import { formatPrice, messageFrom } from "@/lib/format";

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
	const expertsQuery = useExperts();
	const savedExpertsQuery = useSavedExperts();
	const saveExpertMutation = useSaveExpert();
	const removeSavedExpertMutation = useRemoveSavedExpert();
	const [category, setCategory] = useState("All");
	const [query, setQuery] = useState("");
	const [sort, setSort] = useState<"name" | "price-low" | "price-high">("name");
	const experts = expertsQuery.data?.experts ?? [];
	const categories = useMemo(
		() => ["All", ...new Set(experts.map((expert) => expert.category))],
		[experts],
	);
	const filtered = useMemo(() => {
		const normalizedQuery = query.trim().toLowerCase();
		const matches = experts.filter((expert) => {
			const matchesCategory =
				category === "All" || expert.category === category;
			const matchesQuery =
				!normalizedQuery ||
				[expert.displayName, expert.title, expert.category, expert.bio].some(
					(value) => value.toLowerCase().includes(normalizedQuery),
				);
			return matchesCategory && matchesQuery;
		});
		return [...matches].sort((left, right) => {
			if (sort === "price-low")
				return left.hourlyRateCents - right.hourlyRateCents;
			if (sort === "price-high")
				return right.hourlyRateCents - left.hourlyRateCents;
			return left.displayName.localeCompare(right.displayName);
		});
	}, [category, experts, query, sort]);
	const error = expertsQuery.error;
	const savedIds = useMemo(
		() =>
			new Set(
				(savedExpertsQuery.data?.savedExperts ?? []).map(
					(saved) => saved.expert.id,
				),
			),
		[savedExpertsQuery.data?.savedExperts],
	);

	async function toggleSavedExpert(expertId: string) {
		try {
			if (savedIds.has(expertId)) {
				await removeSavedExpertMutation.mutateAsync(expertId);
				toast.success("Expert removed from saved experts.");
			} else {
				await saveExpertMutation.mutateAsync(expertId);
				toast.success("Expert saved.");
			}
		} catch (mutationError) {
			toast.error(
				messageFrom(mutationError, "Unable to update saved experts."),
			);
		}
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
			<Card className="gap-4 py-4">
				<CardContent className="flex flex-col gap-4">
					<InputGroup className="h-11">
						<InputGroupAddon>
							<SearchIcon />
						</InputGroupAddon>
						<InputGroupInput
							onChange={(event) => setQuery(event.target.value)}
							placeholder="Search by specialty, name, or keyword…"
							value={query}
						/>
					</InputGroup>
					<div className="overflow-x-auto pb-1">
						<ToggleGroup
							className="w-max"
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
					</div>
				</CardContent>
			</Card>
			<div className="flex items-center justify-between gap-4">
				<p className="text-muted-foreground text-sm">
					{filtered.length} verified{" "}
					{filtered.length === 1 ? "expert" : "experts"}
				</p>
				<Select
					onValueChange={(value) => setSort(value as typeof sort)}
					value={sort}
				>
					<SelectTrigger aria-label="Sort experts" className="w-44">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectItem value="name">Name</SelectItem>
							<SelectItem value="price-low">Price: low to high</SelectItem>
							<SelectItem value="price-high">Price: high to low</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
			<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{expertsQuery.isPending
					? [1, 2, 3].map((item) => <Skeleton className="h-72" key={item} />)
					: null}
				{filtered.map((expert) => (
					<Card className="shadow-sm" key={expert.id}>
						<CardHeader>
							<CardAction>
								<Tooltip>
									<TooltipTrigger asChild>
										<Button
											aria-label={
												savedIds.has(expert.id)
													? `Remove ${expert.displayName} from saved experts`
													: `Save ${expert.displayName}`
											}
											disabled={
												saveExpertMutation.isPending ||
												removeSavedExpertMutation.isPending
											}
											onClick={() => toggleSavedExpert(expert.id)}
											size="icon-sm"
											variant={savedIds.has(expert.id) ? "secondary" : "ghost"}
										>
											{savedIds.has(expert.id) ? (
												<BookmarkCheckIcon />
											) : (
												<BookmarkIcon />
											)}
										</Button>
									</TooltipTrigger>
									<TooltipContent>
										{savedIds.has(expert.id)
											? "Remove saved expert"
											: "Save expert"}
									</TooltipContent>
								</Tooltip>
							</CardAction>
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
						<CardFooter className="justify-between gap-3 border-t-0 bg-transparent pt-0">
							<div>
								<p className="font-semibold text-primary">
									{formatPrice(expert.hourlyRateCents)}
								</p>
								<p className="text-muted-foreground text-xs">per session</p>
							</div>
							<div className="flex gap-2">
								<Button asChild size="sm" variant="outline">
									<Link params={{ id: expert.id }} to="/experts/$id">
										View profile
									</Link>
								</Button>
								<Button asChild size="sm">
									<Link
										params={{ expertId: expert.id }}
										to="/client/bookings/new/$expertId"
									>
										Book a time
									</Link>
								</Button>
							</div>
						</CardFooter>
					</Card>
				))}
			</div>
			{!expertsQuery.isPending && filtered.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<SearchIcon />
						</EmptyMedia>
						<EmptyTitle>No matching experts</EmptyTitle>
						<EmptyDescription>
							Try another name, specialty, or category.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : null}
		</div>
	);
}
