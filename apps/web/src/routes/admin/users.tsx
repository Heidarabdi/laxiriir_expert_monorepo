import { createFileRoute } from "@tanstack/react-router";
import {
	BadgeCheckIcon,
	SearchIcon,
	ShieldIcon,
	UserRoundIcon,
	UsersIcon,
} from "lucide-react";
import { useState } from "react";

import { PageShell } from "@/components/page-shell";
import { ProtectedPage } from "@/components/protected-page";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
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
import { useAdminUsers } from "@/hooks/use-auth";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/admin/users")({
	component: AdminUsersRoute,
	head: () => ({ meta: [{ title: "User Management | Laxiriir Expert" }] }),
});

function AdminUsersRoute() {
	return (
		<ProtectedPage roles={["admin"]}>
			<PageShell>
				<AdminUsers />
			</PageShell>
		</ProtectedPage>
	);
}

function AdminUsers() {
	const usersQuery = useAdminUsers();
	const [search, setSearch] = useState("");
	const [role, setRole] = useState("all");
	const users = usersQuery.data?.users ?? [];
	const filtered = users.filter((user) => {
		const matchesSearch = `${user.displayName} ${user.email}`
			.toLowerCase()
			.includes(search.toLowerCase());
		return matchesSearch && (role === "all" || user.primaryRole === role);
	});
	const stats = [
		{ icon: UsersIcon, label: "All accounts", value: users.length },
		{
			icon: UserRoundIcon,
			label: "Clients",
			value: users.filter((user) => user.primaryRole === "client").length,
		},
		{
			icon: ShieldIcon,
			label: "Experts",
			value: users.filter((user) => user.primaryRole === "expert").length,
		},
		{
			icon: BadgeCheckIcon,
			label: "Verified",
			value: users.filter((user) => user.emailVerified).length,
		},
	];

	return (
		<div className="flex flex-col gap-6">
			<WorkspaceHeading
				description="Search every identity, confirm access state, and understand the platform audience."
				eyebrow="People"
				title="Users"
			/>
			{usersQuery.isError ? (
				<Alert variant="destructive">
					<AlertTitle>Unable to load users</AlertTitle>
					<AlertDescription>{usersQuery.error.message}</AlertDescription>
				</Alert>
			) : null}
			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map(({ icon: Icon, label, value }) => (
					<Card key={label}>
						<CardHeader>
							<CardDescription>{label}</CardDescription>
							<CardTitle className="text-3xl tabular-nums">
								{usersQuery.isPending ? (
									<Skeleton className="h-9 w-12" />
								) : (
									value
								)}
							</CardTitle>
							<CardAction className="rounded-lg bg-accent p-3 text-accent-foreground">
								<Icon />
							</CardAction>
						</CardHeader>
					</Card>
				))}
			</div>
			<Card>
				<CardHeader>
					<CardTitle>Account directory</CardTitle>
					<CardDescription>
						{filtered.length} accounts match the current filters.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-5">
					<div className="flex flex-col gap-3 sm:flex-row">
						<div className="relative flex-1">
							<SearchIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
							<Input
								className="pl-9"
								onChange={(event) => setSearch(event.target.value)}
								placeholder="Search name or email…"
								value={search}
							/>
						</div>
						<Select onValueChange={setRole} value={role}>
							<SelectTrigger className="w-full sm:w-44">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All roles</SelectItem>
								<SelectItem value="client">Clients</SelectItem>
								<SelectItem value="expert">Experts</SelectItem>
								<SelectItem value="admin">Admins</SelectItem>
							</SelectContent>
						</Select>
					</div>
					{usersQuery.isPending ? (
						<Skeleton className="h-72" />
					) : (
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>User</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Email status</TableHead>
										<TableHead>Joined</TableHead>
										<TableHead className="text-right">Account ID</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{filtered.map((user) => (
										<TableRow key={user.id}>
											<TableCell>
												<div className="flex items-center gap-3">
													<Avatar>
														<AvatarFallback>
															{user.displayName.slice(0, 2).toUpperCase()}
														</AvatarFallback>
													</Avatar>
													<div>
														<p className="font-medium">{user.displayName}</p>
														<p className="text-muted-foreground text-xs">
															{user.email}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Badge className="capitalize" variant="secondary">
													{user.primaryRole}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													variant={user.emailVerified ? "default" : "outline"}
												>
													{user.emailVerified ? "Verified" : "Unverified"}
												</Badge>
											</TableCell>
											<TableCell>{formatDate(user.createdAt)}</TableCell>
											<TableCell className="max-w-40 truncate text-right font-mono text-muted-foreground text-xs">
												{user.id}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
