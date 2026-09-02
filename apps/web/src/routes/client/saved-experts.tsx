import { createFileRoute, Link } from "@tanstack/react-router";
import { BookmarkIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

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
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useRemoveSavedExpert, useSavedExperts } from "@/hooks/use-engagements";
import { formatPrice, messageFrom } from "@/lib/format";

export const Route = createFileRoute("/client/saved-experts")({
	component: SavedExpertsRoute,
	head: () => ({ meta: [{ title: "Saved Experts | Laxiriir Expert" }] }),
});

function SavedExpertsRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<SavedExperts />
			</PageShell>
		</ProtectedPage>
	);
}

function SavedExperts() {
	const savedExpertsQuery = useSavedExperts();
	const removeMutation = useRemoveSavedExpert();
	const savedExperts = savedExpertsQuery.data?.savedExperts ?? [];

	async function removeExpert(expertId: string) {
		try {
			await removeMutation.mutateAsync(expertId);
			toast.success("Expert removed from your saved list.");
		} catch (error) {
			toast.error(messageFrom(error, "Unable to remove this expert."));
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Keep trusted experts close and return when you are ready to book."
				eyebrow="Directory"
				title="Saved experts"
			/>

			{savedExpertsQuery.error ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load saved experts</AlertTitle>
					<AlertDescription>
						{messageFrom(savedExpertsQuery.error, "Please try again.")}
					</AlertDescription>
				</Alert>
			) : null}

			{savedExpertsQuery.isPending ? (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{[1, 2, 3].map((item) => (
						<Skeleton className="h-72" key={item} />
					))}
				</div>
			) : null}

			{!savedExpertsQuery.isPending && savedExperts.length > 0 ? (
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
					{savedExperts.map(({ expert }) => (
						<Card key={expert.id}>
							<CardHeader>
								<div className="flex items-center gap-3">
									<Avatar size="lg">
										<AvatarImage
											alt={expert.displayName}
											src={expert.avatarUrl}
										/>
										<AvatarFallback>
											{expert.displayName.slice(0, 2).toUpperCase()}
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
							<CardContent className="flex flex-1 flex-col gap-3">
								<Badge className="w-fit" variant="secondary">
									{expert.category}
								</Badge>
								<p className="line-clamp-3 text-muted-foreground text-sm">
									{expert.bio}
								</p>
								<p className="mt-auto font-semibold text-primary">
									{formatPrice(expert.hourlyRateCents)} per session
								</p>
							</CardContent>
							<CardFooter className="justify-between gap-2">
								<Button
									aria-label={`Remove ${expert.displayName} from saved experts`}
									disabled={removeMutation.isPending}
									onClick={() => removeExpert(expert.id)}
									size="icon-sm"
									variant="ghost"
								>
									<Trash2Icon />
								</Button>
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
			) : null}

			{!savedExpertsQuery.isPending && savedExperts.length === 0 ? (
				<Empty className="border bg-card">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<BookmarkIcon />
						</EmptyMedia>
						<EmptyTitle>No saved experts yet</EmptyTitle>
						<EmptyDescription>
							Save experts from the directory to keep a personal shortlist.
						</EmptyDescription>
					</EmptyHeader>
					<EmptyContent>
						<Button asChild>
							<Link to="/client/experts">
								<SearchIcon data-icon="inline-start" />
								Browse experts
							</Link>
						</Button>
					</EmptyContent>
				</Empty>
			) : null}
		</div>
	);
}
