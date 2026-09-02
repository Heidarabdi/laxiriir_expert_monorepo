import type { SupportCaseStatus } from "@repo/contracts/workspace";
import { InboxIcon } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useAdminSupportCases, useUpdateAdminSupportCase } from "@/hooks/use-workspace";
import { messageFrom } from "@/lib/format";

const statusLabels: Record<SupportCaseStatus, string> = { open: "Open", in_progress: "In progress", resolved: "Resolved" };

export function AdminSupportWorkspace() {
	const casesQuery = useAdminSupportCases();
	const updateMutation = useUpdateAdminSupportCase();
	const cases = casesQuery.data?.cases ?? [];

	async function update(id: string, status: SupportCaseStatus, assignToMe = false) {
		try {
			await updateMutation.mutateAsync({ id, update: { assignToMe, status } });
			toast.success("Support case updated.");
		} catch (error) {
			toast.error(messageFrom(error, "Unable to update this case."));
		}
	}

	return <div className="flex flex-col gap-6">
		<WorkspaceHeading description="Triage customer requests, take ownership, and close resolved cases." eyebrow="Operations" title="Support queue" />
		{casesQuery.error || updateMutation.error ? <Alert variant="destructive"><AlertTitle>Support queue needs attention</AlertTitle><AlertDescription>{messageFrom(casesQuery.error ?? updateMutation.error, "Please try again.")}</AlertDescription></Alert> : null}
		{casesQuery.isPending ? <Skeleton className="h-96" /> : null}
		{!casesQuery.isPending && cases.length === 0 ? <Empty className="min-h-80 border bg-card"><EmptyHeader><EmptyMedia variant="icon"><InboxIcon /></EmptyMedia><EmptyTitle>The queue is clear</EmptyTitle><EmptyDescription>New client and expert support cases will appear here.</EmptyDescription></EmptyHeader></Empty> : null}
		<div className="grid gap-4 xl:grid-cols-2">{cases.map((supportCase) => <Card key={supportCase.id}><CardHeader><CardTitle>{supportCase.subject}</CardTitle><CardDescription>{supportCase.requester.displayName} · {supportCase.requester.email}</CardDescription><CardAction className="flex gap-2"><Badge variant={supportCase.priority === "urgent" ? "destructive" : "outline"}>{supportCase.priority}</Badge><Badge>{statusLabels[supportCase.status]}</Badge></CardAction></CardHeader><CardContent><p className="whitespace-pre-wrap text-muted-foreground text-sm leading-6">{supportCase.description}</p></CardContent><CardFooter className="flex flex-wrap gap-2"><Button disabled={updateMutation.isPending} onClick={() => update(supportCase.id, "in_progress", true)} size="sm" variant="outline">Assign to me</Button><Button disabled={updateMutation.isPending || supportCase.status === "resolved"} onClick={() => update(supportCase.id, "resolved")} size="sm">Mark resolved</Button>{supportCase.status === "resolved" ? <Button disabled={updateMutation.isPending} onClick={() => update(supportCase.id, "open")} size="sm" variant="ghost">Reopen</Button> : null}</CardFooter></Card>)}</div>
	</div>;
}
