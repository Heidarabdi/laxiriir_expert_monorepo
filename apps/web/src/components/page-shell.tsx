import type { PrimaryRole } from "@repo/contracts/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	CalendarDaysIcon,
	ChartNoAxesCombinedIcon,
	LayoutDashboardIcon,
	LogOutIcon,
	MessageSquareIcon,
	SearchIcon,
	ShieldCheckIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser, useSignOut } from "@/hooks/use-auth";

const navigation: Record<
	PrimaryRole,
	Array<{ icon: typeof LayoutDashboardIcon; label: string; to: string }>
> = {
	admin: [{ icon: ShieldCheckIcon, label: "Expert review", to: "/admin" }],
	client: [
		{ icon: LayoutDashboardIcon, label: "Dashboard", to: "/client" },
		{ icon: SearchIcon, label: "Experts", to: "/client/experts" },
		{ icon: CalendarDaysIcon, label: "Sessions", to: "/client/sessions" },
		{ icon: MessageSquareIcon, label: "Messages", to: "/client/messages" },
		{
			icon: ChartNoAxesCombinedIcon,
			label: "Insights",
			to: "/client/insights",
		},
	],
	expert: [
		{ icon: LayoutDashboardIcon, label: "Dashboard", to: "/expert" },
		{ icon: CalendarDaysIcon, label: "Availability", to: "/expert/calendar" },
	],
};

export function PageShell({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const { data: user } = useCurrentUser();
	const signOutMutation = useSignOut();
	const items = user ? navigation[user.primaryRole] : [];

	async function handleSignOut() {
		await signOutMutation.mutateAsync();
		await navigate({ to: "/" });
	}

	return (
		<div className="min-h-svh bg-muted/30">
			<header className="border-b bg-background">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
					<Link className="flex items-center gap-2 font-semibold" to="/">
						<ShieldCheckIcon className="size-5 text-primary" />
						Laxiriir Expert
					</Link>
					<div className="flex items-center gap-3">
						<Avatar size="sm">
							<AvatarFallback>
								{user?.displayName.slice(0, 2).toUpperCase() ?? "LX"}
							</AvatarFallback>
						</Avatar>
						<div className="hidden text-right sm:block">
							<p className="font-medium text-sm">{user?.displayName}</p>
							<p className="text-muted-foreground text-xs capitalize">
								{user?.primaryRole}
							</p>
						</div>
						<Button
							disabled={signOutMutation.isPending}
							onClick={handleSignOut}
							size="sm"
							variant="ghost"
						>
							{signOutMutation.isPending ? (
								<Spinner data-icon="inline-start" />
							) : (
								<LogOutIcon data-icon="inline-start" />
							)}
							Sign out
						</Button>
					</div>
				</div>
			</header>
			<div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[220px_1fr]">
				<aside className="h-fit rounded-xl border bg-background p-3">
					<nav className="flex gap-2 overflow-x-auto lg:flex-col">
						{items.map((item) => {
							const Icon = item.icon;
							return (
								<Button
									asChild
									className="justify-start"
									key={item.to}
									variant="ghost"
								>
									<Link to={item.to}>
										<Icon data-icon="inline-start" />
										{item.label}
									</Link>
								</Button>
							);
						})}
					</nav>
					<Separator className="my-3" />
					<p className="px-3 text-muted-foreground text-xs">
						Powered by Fastify and TanStack.
					</p>
				</aside>
				<main className="min-w-0">{children}</main>
			</div>
		</div>
	);
}
