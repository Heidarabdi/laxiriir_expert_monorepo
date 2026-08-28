import type {
	AdminExpertSummary,
	ExpertStatusAction,
} from "@repo/contracts/auth";
import { createFileRoute } from "@tanstack/react-router";
import {
	CheckIcon,
	ShieldCheckIcon,
	UserRoundCheckIcon,
	UserRoundXIcon,
	UsersIcon,
} from "lucide-react";
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
import { useAdminExperts, useModerateExpert } from "@/hooks/use-auth";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/")({
	component: AdminRoute,
	head: () => ({ meta: [{ title: "Admin | Laxiriir Expert" }] }),
});

function AdminRoute() {
	return (
		<ProtectedPage roles={["admin"]}>
			<PageShell>
				<AdminDashboard />
			</PageShell>
		</ProtectedPage>
	);
}

const statusVariant = {
	approved: "default",
	pending_review: "secondary",
	rejected: "destructive",
	suspended: "outline",
} as const;

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
						This updates the expert’s access immediately.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => void moderate()}>
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function AdminDashboard() {
	const expertsQuery = useAdminExperts();
	const experts = expertsQuery.data?.experts ?? [];
	const pending = experts.filter(
		(expert) => expert.expertStatus === "pending_review",
	);
	const approved = experts.filter(
		(expert) => expert.expertStatus === "approved",
	);
	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Review every expert account and control access from live server data."
				eyebrow="Administration"
				title="Expert moderation"
			/>
			{expertsQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load experts</AlertTitle>
					<AlertDescription>{expertsQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-3">
				<Card>
					<CardHeader>
						<CardDescription>Total experts</CardDescription>
						<CardTitle className="text-3xl">{experts.length}</CardTitle>
					</CardHeader>
					<CardContent>
						<UsersIcon />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Waiting for review</CardDescription>
						<CardTitle className="text-3xl">{pending.length}</CardTitle>
					</CardHeader>
					<CardContent>
						<ShieldCheckIcon />
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>Approved</CardDescription>
						<CardTitle className="text-3xl">{approved.length}</CardTitle>
					</CardHeader>
					<CardContent>
						<CheckIcon />
					</CardContent>
				</Card>
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Expert accounts</CardTitle>
					<CardDescription>
						Approve applications or restrict existing expert access.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{expertsQuery.isPending ? (
						<Skeleton className="h-56" />
					) : (
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
								{experts.map((expert) => (
									<TableRow key={expert.identityUserId}>
										<TableCell>
											<p className="font-medium">{expert.displayName}</p>
											<p className="text-muted-foreground text-xs">
												{expert.email}
											</p>
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
					)}
					{!expertsQuery.isPending && experts.length === 0 ? (
						<p className="py-8 text-center text-muted-foreground text-sm">
							No expert accounts yet.
						</p>
					) : null}
				</CardContent>
			</Card>
		</div>
	);
}
