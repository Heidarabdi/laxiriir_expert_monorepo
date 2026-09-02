import type { SupportCasePriority, SupportCaseStatus } from "@repo/contracts/workspace";
import { LifeBuoyIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useCreateSupportCase, useSupportCases } from "@/hooks/use-workspace";
import { messageFrom } from "@/lib/format";

const statusLabels: Record<SupportCaseStatus, string> = { open: "Open", in_progress: "In progress", resolved: "Resolved" };
const supportDate = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeZone: "UTC" });

export function SupportWorkspace() {
	const casesQuery = useSupportCases();
	const createMutation = useCreateSupportCase();
	const [open, setOpen] = useState(false);
	const [subject, setSubject] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<SupportCasePriority>("normal");
	const cases = casesQuery.data?.cases ?? [];

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			await createMutation.mutateAsync({ description, priority, subject });
			setOpen(false);
			setSubject("");
			setDescription("");
			setPriority("normal");
			toast.success("Support case created.");
		} catch (error) {
			toast.error(messageFrom(error, "Unable to create the support case."));
		}
	}

	return <div className="flex flex-col gap-6">
		<WorkspaceHeading actions={<Dialog onOpenChange={setOpen} open={open}><DialogTrigger asChild><Button><PlusIcon data-icon="inline-start" />New support case</Button></DialogTrigger><DialogContent><DialogHeader><DialogTitle>Ask the support team</DialogTitle><DialogDescription>Describe the problem and include enough context for the operations team to act.</DialogDescription></DialogHeader><form className="flex flex-col gap-5" onSubmit={submit}><FieldGroup><Field><FieldLabel htmlFor="support-subject">Subject</FieldLabel><Input id="support-subject" minLength={4} onChange={(event) => setSubject(event.target.value)} required value={subject} /></Field><Field><FieldLabel htmlFor="support-priority">Priority</FieldLabel><Select onValueChange={(value) => setPriority(value as SupportCasePriority)} value={priority}><SelectTrigger id="support-priority"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="normal">Normal</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></Field><Field><FieldLabel htmlFor="support-description">What happened?</FieldLabel><Textarea id="support-description" minLength={20} onChange={(event) => setDescription(event.target.value)} required rows={6} value={description} /></Field></FieldGroup>{createMutation.error ? <Alert variant="destructive"><AlertTitle>Unable to create case</AlertTitle><AlertDescription>{messageFrom(createMutation.error, "Please try again.")}</AlertDescription></Alert> : null}<DialogFooter><Button onClick={() => setOpen(false)} type="button" variant="outline">Cancel</Button><Button disabled={createMutation.isPending} type="submit">{createMutation.isPending ? "Creating…" : "Create case"}</Button></DialogFooter></form></DialogContent></Dialog>} description="Create and follow requests with the operations team." eyebrow="Help center" title="Support" />
		{casesQuery.error ? <Alert variant="destructive"><AlertTitle>Unable to load support cases</AlertTitle><AlertDescription>{messageFrom(casesQuery.error, "Please try again.")}</AlertDescription></Alert> : null}
		{casesQuery.isPending ? <Skeleton className="h-80" /> : null}
		{!casesQuery.isPending && cases.length === 0 ? <Empty className="min-h-80 border bg-card"><EmptyHeader><EmptyMedia variant="icon"><LifeBuoyIcon /></EmptyMedia><EmptyTitle>No support cases</EmptyTitle><EmptyDescription>If something blocks a consultation, open a case and the operations team can track it here.</EmptyDescription></EmptyHeader></Empty> : null}
		<div className="grid gap-4 lg:grid-cols-2">{cases.map((supportCase) => <Card key={supportCase.id}><CardHeader><CardTitle>{supportCase.subject}</CardTitle><CardDescription>{supportDate.format(new Date(supportCase.createdAt))} UTC</CardDescription><CardAction className="flex gap-2"><Badge variant={supportCase.priority === "urgent" ? "destructive" : "outline"}>{supportCase.priority}</Badge><Badge>{statusLabels[supportCase.status]}</Badge></CardAction></CardHeader><CardContent><p className="whitespace-pre-wrap text-muted-foreground text-sm leading-6">{supportCase.description}</p></CardContent></Card>)}</div>
	</div>;
}
