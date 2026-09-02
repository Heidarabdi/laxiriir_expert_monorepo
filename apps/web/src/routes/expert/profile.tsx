import type { ExpertProfileInput } from "@repo/contracts/consultations";
import { createFileRoute } from "@tanstack/react-router";
import {
	BadgeCheckIcon,
	PencilIcon,
	StarIcon,
	UserRoundIcon,
} from "lucide-react";
import { useState } from "react";
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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { WorkspaceHeading } from "@/components/workspace-heading";
import {
	useExpertProfile,
	useUpdateExpertProfile,
} from "@/hooks/use-consultations";

export const Route = createFileRoute("/expert/profile")({
	component: ExpertProfileRoute,
	head: () => ({ meta: [{ title: "Expert Profile | Laxiriir Expert" }] }),
});

const emptyForm: ExpertProfileInput = {
	avatarUrl: "",
	bio: "",
	category: "",
	displayName: "",
	hourlyRateCents: 0,
	title: "",
};

function ExpertProfileRoute() {
	return (
		<ProtectedPage requireApprovedExpert roles={["expert"]}>
			<PageShell>
				<ExpertProfile />
			</PageShell>
		</ProtectedPage>
	);
}

function ExpertProfile() {
	const profileQuery = useExpertProfile();
	const updateMutation = useUpdateExpertProfile();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [form, setForm] = useState<ExpertProfileInput>(emptyForm);
	const profile = profileQuery.data?.expert;

	function openEditor() {
		if (!profile) return;
		setForm({
			avatarUrl: profile.avatarUrl,
			bio: profile.bio,
			category: profile.category,
			displayName: profile.displayName,
			hourlyRateCents: profile.hourlyRateCents,
			title: profile.title,
		});
		setDialogOpen(true);
	}

	async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		try {
			await updateMutation.mutateAsync(form);
			setDialogOpen(false);
			toast.success("Profile updated.");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Unable to update profile.",
			);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
				<WorkspaceHeading
					description="Manage the professional details clients use when deciding to book."
					eyebrow="Public presence"
					title="Expert profile"
				/>
				<Button disabled={!profile} onClick={openEditor}>
					<PencilIcon data-icon="inline-start" />
					Edit profile
				</Button>
			</div>
			{profileQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load profile</AlertTitle>
					<AlertDescription>{profileQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			{profileQuery.isPending ? <Skeleton className="h-[32rem]" /> : null}
			{profile ? (
				<div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(19rem,0.8fr)]">
					<Card>
						<CardContent className="flex flex-col gap-8 p-6 sm:p-8">
							<div className="flex flex-col gap-5 sm:flex-row sm:items-center">
								<Avatar className="size-24 border-4 border-background shadow-md">
									<AvatarImage
										alt={profile.displayName}
										src={profile.avatarUrl}
									/>
									<AvatarFallback className="text-xl">
										{profile.displayName.slice(0, 2)}
									</AvatarFallback>
								</Avatar>
								<div className="min-w-0 flex-1">
									<div className="flex flex-wrap items-center gap-2">
										<h2 className="font-heading font-semibold text-2xl">
											{profile.displayName}
										</h2>
										<Badge className="gap-1" variant="secondary">
											<BadgeCheckIcon /> Verified
										</Badge>
									</div>
									<p className="mt-1 text-muted-foreground">{profile.title}</p>
									<Badge className="mt-3" variant="outline">
										{profile.category}
									</Badge>
								</div>
							</div>
							<div>
								<h3 className="font-heading font-semibold text-lg">About</h3>
								<p className="mt-3 max-w-3xl text-muted-foreground leading-7">
									{profile.bio}
								</p>
							</div>
						</CardContent>
					</Card>
					<div className="flex flex-col gap-6">
						<Card>
							<CardHeader>
								<CardDescription>Current session rate</CardDescription>
								<CardTitle className="text-3xl">
									${(profile.hourlyRateCents / 100).toLocaleString()}
								</CardTitle>
							</CardHeader>
							<CardContent className="text-muted-foreground text-sm">
								Shown publicly for each one-hour consultation.
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2 text-base">
									<StarIcon className="text-primary" /> Profile quality
								</CardTitle>
								<CardDescription>
									Your public profile has all required booking details.
								</CardDescription>
							</CardHeader>
						</Card>
					</div>
				</div>
			) : null}
			<Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
				<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit expert profile</DialogTitle>
						<DialogDescription>
							Changes are published to the expert directory as soon as you save.
						</DialogDescription>
					</DialogHeader>
					<form className="flex flex-col gap-6" onSubmit={saveProfile}>
						<FieldGroup className="grid sm:grid-cols-2">
							<Field>
								<FieldLabel htmlFor="display-name">Display name</FieldLabel>
								<Input
									id="display-name"
									minLength={2}
									onChange={(event) =>
										setForm((value) => ({
											...value,
											displayName: event.target.value,
										}))
									}
									required
									value={form.displayName}
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="profile-title">
									Professional title
								</FieldLabel>
								<Input
									id="profile-title"
									minLength={2}
									onChange={(event) =>
										setForm((value) => ({
											...value,
											title: event.target.value,
										}))
									}
									required
									value={form.title}
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="category">Specialty</FieldLabel>
								<Input
									id="category"
									minLength={2}
									onChange={(event) =>
										setForm((value) => ({
											...value,
											category: event.target.value,
										}))
									}
									required
									value={form.category}
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="hourly-rate">
									Session rate (USD)
								</FieldLabel>
								<Input
									id="hourly-rate"
									min={0}
									onChange={(event) =>
										setForm((value) => ({
											...value,
											hourlyRateCents: Math.round(
												Number(event.target.value) * 100,
											),
										}))
									}
									required
									type="number"
									value={form.hourlyRateCents / 100}
								/>
							</Field>
						</FieldGroup>
						<Field>
							<FieldLabel htmlFor="avatar-url">Profile image URL</FieldLabel>
							<Input
								id="avatar-url"
								onChange={(event) =>
									setForm((value) => ({
										...value,
										avatarUrl: event.target.value,
									}))
								}
								required
								type="url"
								value={form.avatarUrl}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="bio">Professional biography</FieldLabel>
							<Textarea
								id="bio"
								minLength={40}
								onChange={(event) =>
									setForm((value) => ({ ...value, bio: event.target.value }))
								}
								required
								rows={6}
								value={form.bio}
							/>
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
								<UserRoundIcon data-icon="inline-start" />
								{updateMutation.isPending ? "Saving…" : "Save profile"}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</div>
	);
}
