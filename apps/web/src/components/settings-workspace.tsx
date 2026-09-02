import type { WorkspacePreferences } from "@repo/contracts/workspace";
import { BellRingIcon, Globe2Icon, SaveIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { usePreferences, useUpdatePreferences } from "@/hooks/use-workspace";
import { messageFrom } from "@/lib/format";

const initialPreferences: WorkspacePreferences = {
	emailBookingUpdates: true,
	inAppBookingUpdates: true,
	timezone: "UTC",
};

export function SettingsWorkspace() {
	const preferencesQuery = usePreferences();
	const updateMutation = useUpdatePreferences();
	const [form, setForm] = useState(initialPreferences);

	useEffect(() => {
		if (preferencesQuery.data) setForm(preferencesQuery.data.preferences);
	}, [preferencesQuery.data]);

	async function save(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			await updateMutation.mutateAsync(form);
			toast.success("Workspace preferences saved.");
		} catch (error) {
			toast.error(messageFrom(error, "Unable to save preferences."));
		}
	}

	return <div className="flex flex-col gap-6">
		<WorkspaceHeading description="Choose how consultation updates reach you and which timezone the workspace uses." eyebrow="Account" title="Settings" />
		{preferencesQuery.error || updateMutation.error ? <Alert variant="destructive"><AlertTitle>Unable to save settings</AlertTitle><AlertDescription>{messageFrom(preferencesQuery.error ?? updateMutation.error, "Please try again.")}</AlertDescription></Alert> : null}
		{preferencesQuery.isPending ? <Skeleton className="h-96" /> : null}
		{preferencesQuery.data ? <form className="grid gap-6 xl:grid-cols-2" onSubmit={save}>
			<Card>
				<CardHeader><CardTitle className="flex items-center gap-2"><Globe2Icon /> Timezone</CardTitle><CardDescription>Used when presenting consultation schedules and account activity.</CardDescription></CardHeader>
				<CardContent><Field><FieldLabel htmlFor="timezone">IANA timezone</FieldLabel><Input aria-describedby="timezone-help" id="timezone" maxLength={100} onChange={(event) => setForm((value) => ({ ...value, timezone: event.target.value }))} placeholder="Africa/Nairobi" required value={form.timezone} /><FieldDescription id="timezone-help">Examples: Africa/Nairobi, Europe/London, America/New_York.</FieldDescription></Field></CardContent>
			</Card>
			<Card>
				<CardHeader><CardTitle className="flex items-center gap-2"><BellRingIcon /> Booking updates</CardTitle><CardDescription>Control the channels used for confirmations, changes, and cancellations.</CardDescription></CardHeader>
				<CardContent><FieldGroup>
					<Field orientation="horizontal"><Checkbox checked={form.inAppBookingUpdates} id="in-app-updates" onCheckedChange={(checked) => setForm((value) => ({ ...value, inAppBookingUpdates: checked === true }))} /><FieldContent><FieldLabel htmlFor="in-app-updates"><FieldTitle>In-app notifications</FieldTitle></FieldLabel><FieldDescription>Show booking activity inside this workspace.</FieldDescription></FieldContent></Field>
					<Field orientation="horizontal"><Checkbox checked={form.emailBookingUpdates} id="email-updates" onCheckedChange={(checked) => setForm((value) => ({ ...value, emailBookingUpdates: checked === true }))} /><FieldContent><FieldLabel htmlFor="email-updates"><FieldTitle>Email notifications</FieldTitle></FieldLabel><FieldDescription>Email booking changes when the production mail provider is enabled.</FieldDescription></FieldContent></Field>
				</FieldGroup></CardContent>
			</Card>
			<div className="flex justify-end xl:col-span-2"><Button disabled={updateMutation.isPending} type="submit"><SaveIcon data-icon="inline-start" />{updateMutation.isPending ? "Saving…" : "Save preferences"}</Button></div>
		</form> : null}
	</div>;
}
