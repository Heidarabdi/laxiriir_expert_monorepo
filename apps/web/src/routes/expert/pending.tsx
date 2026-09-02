import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheckIcon, Clock3Icon, MailIcon } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useCurrentUser } from "@/hooks/use-auth";

export const Route = createFileRoute("/expert/pending")({
	component: ExpertPendingRoute,
	head: () => ({ meta: [{ title: "Expert Review | Laxiriir Expert" }] }),
});

function ExpertPendingRoute() {
	return (
		<ProtectedPage roles={["expert"]}>
			<PageShell>
				<ExpertPending />
			</PageShell>
		</ProtectedPage>
	);
}

function ExpertPending() {
	const { data: user } = useCurrentUser();
	const status = user?.expertStatus ?? "pending_review";
	const copy =
		status === "rejected"
			? "Your application was not approved. Contact support if you need clarification."
			: status === "suspended"
				? "Your expert access is suspended. Contact support to resolve the account review."
				: "Your expert application is waiting for an administrator to review it.";
	const isBlocked = status === "rejected" || status === "suspended";
	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-6">
			<WorkspaceHeading
				description="Your account is active; expert tools unlock after approval."
				eyebrow="Expert application"
				title="Review status"
			/>
			<Card>
				<CardHeader className="items-center text-center">
					<div className="rounded-xl bg-accent p-4 text-accent-foreground">
						{status === "approved" ? (
							<BadgeCheckIcon className="size-8" />
						) : (
							<Clock3Icon className="size-8" />
						)}
					</div>
					<CardTitle className="capitalize">
						{status.replace("_", " ")}
					</CardTitle>
					<CardDescription>{copy}</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col items-center gap-4 text-center">
					<Badge variant={isBlocked ? "destructive" : "secondary"}>
						{user?.email}
					</Badge>
					<div className="flex max-w-md items-start gap-3 rounded-xl border bg-muted/40 p-4 text-left text-muted-foreground text-sm">
						<MailIcon className="mt-0.5 shrink-0 text-primary" />
						<p>
							You can sign out and return later. We save the review status to
							your account and show the updated result when you come back.
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
