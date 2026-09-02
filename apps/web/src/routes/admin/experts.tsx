import type {
	AdminExpertSummary,
	ExpertStatusAction,
} from "@repo/contracts/auth";
import { createFileRoute } from "@tanstack/react-router";
import {
	SearchIcon,
	ShieldCheckIcon,
	UserRoundCheckIcon,
	UserRoundXIcon,
} from "lucide-react";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useAdminExperts, useModerateExpert } from "@/hooks/use-auth";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/experts")({
	component: AdminExpertsRoute,
	head: () => ({ meta: [{ title: "Expert Review | Laxiriir Expert" }] }),
});

const statusVariant = {
	approved: "default",
	pending_review: "secondary",
	rejected: "destructive",
	suspended: "outline",
} as const;

type StatusFilter = "all" | AdminExpertSummary["expertStatus"];

function AdminExpertsRoute() {
	return (
		<ProtectedPage roles={["admin"]}>
			<PageShell>
				<ExpertModeration />
			</PageShell>
		</ProtectedPage>
	);
}

function ModerationButton({
	action,
	expert,
}: {
	action: ExpertStatusAction;
	expert: AdminExpertSummary;
}) {
	const mutation = useModerateExpert();
	const labels = {
		approve: "Approve",
		reject: "Reject",
		suspend: "Suspend",
	} as const;
	const icons = {
		approve: UserRoundCheckIcon,
		reject: UserRoundXIcon,
		suspend: ShieldCheckIcon,
	} as const;
	const Icon = icons[action];

	async function moderate() {
		try {
			await mutation.mutateAsync({ action, expertId: expert.identityUserId });
			toast.success(
				`${expert.displayName}: ${labels[action].toLowerCase()} completed.`,
			);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update expert.",
			);
		}
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					size="sm"
					variant={action === "approve" ? "default" : "outline"}
				>
					<Icon data-icon="inline-start" />
					{labels[action]}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						{labels[action]} {expert.displayName}?
					</AlertDialogTitle>
					<AlertDialogDescription>
						This updates the expert’s platform access immediately.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => void moderate()}>
						Confirm {labels[action].toLowerCase()}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function ExpertModeration() {
	const expertsQuery = useAdminExperts();
	const experts = expertsQuery.data?.experts ?? [];
	const [search, setSearch] = useState("");
	const [status, setStatus] = useState<StatusFilter>("all");
	const normalizedSearch = search.trim().toLowerCase();
	const filteredExperts = experts.filter((expert) => {
		const matchesStatus = status === "all" || expert.expertStatus === status;
		const matchesSearch =
			!normalizedSearch ||
			expert.displayName.toLowerCase().includes(normalizedSearch) ||
			expert.email.toLowerCase().includes(normalizedSearch);
		return matchesStatus && matchesSearch;
	});
	const count = (value: StatusFilter) =>
		value === "all"
			? experts.length
			: experts.filter((expert) => expert.expertStatus === value).length;

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Search every expert identity, review applications, and control marketplace access."
				eyebrow="Trust and safety"
				title="Expert review"
			/>
			{expertsQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load experts</AlertTitle>
					<AlertDescription>{expertsQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<Card>
				<CardHeader>
					<CardTitle>Expert accounts</CardTitle>
					<CardDescription>
						Approve applications or restrict existing expert access.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<InputGroup>
						<InputGroupAddon>
							<SearchIcon />
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search experts"
							onChange={(event) => setSearch(event.target.value)}
							placeholder="Search by name or email…"
							value={search}
						/>
					</InputGroup>
					<Tabs
						onValueChange={(value) => setStatus(value as StatusFilter)}
						value={status}
					>
						<TabsList className="h-auto flex-wrap">
							<TabsTrigger value="all">All ({count("all")})</TabsTrigger>
							<TabsTrigger value="pending_review">
								Pending ({count("pending_review")})
							</TabsTrigger>
							<TabsTrigger value="approved">
								Approved ({count("approved")})
							</TabsTrigger>
							<TabsTrigger value="rejected">
								Rejected ({count("rejected")})
							</TabsTrigger>
							<TabsTrigger value="suspended">
								Suspended ({count("suspended")})
							</TabsTrigger>
						</TabsList>
					</Tabs>
					{expertsQuery.isPending ? <Skeleton className="h-64" /> : null}
					{!expertsQuery.isPending && filteredExperts.length > 0 ? (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Expert</TableHead>
									<TableHead>Joined</TableHead>
									<TableHead>Status</TableHead>
									<TableHead className="text-right">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredExperts.map((expert) => (
									<TableRow key={expert.identityUserId}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar>
													<AvatarFallback>
														{expert.displayName.slice(0, 2).toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<div>
													<p className="font-medium">{expert.displayName}</p>
													<p className="text-muted-foreground text-xs">
														{expert.email}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>{formatDate(expert.createdAt)}</TableCell>
										<TableCell>
											<Badge variant={statusVariant[expert.expertStatus]}>
												{expert.expertStatus.replace("_", " ")}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex justify-end gap-2">
												{expert.expertStatus !== "approved" ? (
													<ModerationButton action="approve" expert={expert} />
												) : null}
												{expert.expertStatus === "pending_review" ? (
													<ModerationButton action="reject" expert={expert} />
												) : null}
												{expert.expertStatus === "approved" ? (
													<ModerationButton action="suspend" expert={expert} />
												) : null}
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					) : null}
					{!expertsQuery.isPending && filteredExperts.length === 0 ? (
						<Empty className="min-h-64 border">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<ShieldCheckIcon />
								</EmptyMedia>
								<EmptyTitle>No matching experts</EmptyTitle>
								<EmptyDescription>
									Try another name, email, or review status.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
