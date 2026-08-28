import { createFileRoute } from "@tanstack/react-router";
import { BadgeCheckIcon, Clock3Icon, MailIcon } from "lucide-react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
	return (
		<div className="mx-auto flex max-w-2xl flex-col gap-6">
			<WorkspaceHeading
				description="Your account is active; expert tools unlock after approval."
				eyebrow="Expert application"
				title="Review status"
			/>
			<Card>
				<CardHeader className="items-center text-center">
					<div className="rounded-full bg-muted p-4">
						{status === "approved" ? (
							<BadgeCheckIcon className="size-8" />
						) : (
							<Clock3Icon className="size-8" />
						)}
					</div>
					<CardTitle className="capitalize">
						{status.replace("_", " ")}
					</CardTitle>
					<Badge variant="secondary">{user?.email}</Badge>
				</CardHeader>
				<CardContent className="space-y-4 text-center text-muted-foreground text-sm">
					<p>{copy}</p>
					<p className="flex items-center justify-center gap-2">
						<MailIcon className="size-4" />
						You can sign out and return later; your status is saved.
					</p>
				</CardContent>
			</Card>
		</div>
	);
}
