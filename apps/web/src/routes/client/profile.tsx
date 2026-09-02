import { createFileRoute } from "@tanstack/react-router";
import {
	MailIcon,
	PencilIcon,
	ShieldCheckIcon,
	UserRoundIcon,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { WorkspaceHeading } from "@/components/workspace-heading";
import { useCurrentUser, useUpdateCurrentUser } from "@/hooks/use-auth";
import { messageFrom } from "@/lib/format";

export const Route = createFileRoute("/client/profile")({
	component: ProfileRoute,
	head: () => ({ meta: [{ title: "Profile | Laxiriir Expert" }] }),
});

function ProfileRoute() {
	return (
		<ProtectedPage roles={["client"]}>
			<PageShell>
				<ClientProfile />
			</PageShell>
		</ProtectedPage>
	);
}

function ClientProfile() {
	const { data: user } = useCurrentUser();
	const updateMutation = useUpdateCurrentUser();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [displayName, setDisplayName] = useState("");
	if (!user) return null;

	function openEditor() {
		setDisplayName(user?.displayName ?? "");
		setDialogOpen(true);
	}

	async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			await updateMutation.mutateAsync({ displayName });
			setDialogOpen(false);
			toast.success("Account profile updated.");
		} catch (error) {
			toast.error(messageFrom(error, "Unable to update your profile."));
		}
	}

	return (
		<div className="flex max-w-3xl flex-col gap-6">
			<WorkspaceHeading
				actions={
					<Button onClick={openEditor}>
						<PencilIcon data-icon="inline-start" />
						Edit profile
					</Button>
				}
				description="Review the identity and account information connected to your consultations."
				eyebrow="Account"
				title="Profile"
			/>
			<Card>
				<CardHeader>
					<div className="flex items-center gap-4">
						<Avatar size="lg">
							<AvatarFallback>
								{user.displayName.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle>{user.displayName}</CardTitle>
							<CardDescription>{user.email}</CardDescription>
						</div>
					</div>
					<CardAction>
						<Badge variant="secondary">Client account</Badge>
					</CardAction>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<Separator />
					<div className="grid gap-5 sm:grid-cols-2">
						<div className="flex items-start gap-3">
							<span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
								<UserRoundIcon className="size-5" />
							</span>
							<div>
								<p className="text-muted-foreground text-sm">Display name</p>
								<p className="font-medium">{user.displayName}</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
								<MailIcon className="size-5" />
							</span>
							<div className="min-w-0">
								<p className="text-muted-foreground text-sm">Email address</p>
								<p className="truncate font-medium">{user.email}</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<span className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
								<ShieldCheckIcon className="size-5" />
							</span>
							<div>
								<p className="text-muted-foreground text-sm">Verification</p>
								<p className="font-medium">
									{user.emailVerified
										? "Email verified"
										: "Verification pending"}
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
			<Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Edit account profile</DialogTitle>
						<DialogDescription>
							Update the name shown throughout your client workspace.
						</DialogDescription>
					</DialogHeader>
					<form className="flex flex-col gap-6" onSubmit={saveProfile}>
						<Field>
							<FieldLabel htmlFor="client-display-name">
								Display name
							</FieldLabel>
							<Input
								autoComplete="name"
								id="client-display-name"
								maxLength={100}
								minLength={2}
								onChange={(event) => setDisplayName(event.target.value)}
								required
								value={displayName}
							/>
							<FieldDescription>
								Your email and account role cannot be changed here.
							</FieldDescription>
						</Field>
						<DialogFooter>
							<Button
								onClick={() => setDialogOpen(false)}
								type="button"
								variant="outline"
							>
								Cancel
							</Button>
							<Button disabled={updateMutation.isPending} type="submit">
								{updateMutation.isPending ? "Saving…" : "Save changes"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
