import type { PrimaryRole } from "@repo/contracts/auth";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
	BellIcon,
	BookmarkIcon,
	CalendarCheckIcon,
	CalendarDaysIcon,
	ChartNoAxesCombinedIcon,
	ChevronsUpDownIcon,
	CircleDollarSignIcon,
	CreditCardIcon,
	LayoutDashboardIcon,
	LifeBuoyIcon,
	LogOutIcon,
	MessageSquareIcon,
	MonitorIcon,
	MoonIcon,
	SearchIcon,
	ShieldCheckIcon,
	SunIcon,
	SunMoonIcon,
	SettingsIcon,
	UserRoundIcon,
	UsersIcon,
	WaypointsIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser, useSignOut } from "@/hooks/use-auth";

interface NavigationItem {
	icon: typeof LayoutDashboardIcon;
	label: string;
	to: string;
}

interface NavigationGroup {
	items: NavigationItem[];
	label: string;
}

const navigation: Record<PrimaryRole, NavigationGroup[]> = {
	admin: [
		{
			items: [
				{ icon: LayoutDashboardIcon, label: "Dashboard", to: "/admin" },
				{
					icon: ShieldCheckIcon,
					label: "Expert review",
					to: "/admin/experts",
				},
				{
					icon: CalendarCheckIcon,
					label: "Bookings",
					to: "/admin/bookings",
				},
			],
			label: "Workspace",
		},
		{
			items: [
				{
					icon: BellIcon,
					label: "Notifications",
					to: "/admin/notifications",
				},
				{
					icon: CircleDollarSignIcon,
					label: "Finance",
					to: "/admin/finance",
				},
				{ icon: UsersIcon, label: "Users", to: "/admin/users" },
				{
					icon: ChartNoAxesCombinedIcon,
					label: "Analytics",
					to: "/admin/analytics",
				},
				{ icon: LifeBuoyIcon, label: "Support", to: "/admin/support" },
			],
			label: "Operations",
		},
	],
	client: [
		{
			items: [
				{ icon: LayoutDashboardIcon, label: "Dashboard", to: "/client" },
				{ icon: SearchIcon, label: "Experts", to: "/client/experts" },
				{
					icon: CalendarDaysIcon,
					label: "Sessions",
					to: "/client/bookings",
				},
			],
			label: "Workspace",
		},
		{
			items: [
				{ icon: MessageSquareIcon, label: "Messages", to: "/client/messages" },
				{
					icon: BookmarkIcon,
					label: "Saved experts",
					to: "/client/saved-experts",
				},
				{
					icon: BellIcon,
					label: "Notifications",
					to: "/client/notifications",
				},
				{
					icon: ChartNoAxesCombinedIcon,
					label: "Insights",
					to: "/client/insights",
				},
				{ icon: CreditCardIcon, label: "Billing", to: "/client/billing" },
				{ icon: LifeBuoyIcon, label: "Support", to: "/client/support" },
			],
			label: "Tools",
		},
	],
	expert: [
		{
			items: [
				{ icon: LayoutDashboardIcon, label: "Dashboard", to: "/expert" },
				{
					icon: CalendarDaysIcon,
					label: "Availability",
					to: "/expert/calendar",
				},
				{
					icon: CalendarCheckIcon,
					label: "Sessions",
					to: "/expert/sessions",
				},
			],
			label: "Workspace",
		},
		{
			items: [
				{ icon: MessageSquareIcon, label: "Messages", to: "/expert/messages" },
				{ icon: BellIcon, label: "Notifications", to: "/expert/notifications" },
				{
					icon: CircleDollarSignIcon,
					label: "Earnings",
					to: "/expert/earnings",
				},
				{ icon: LifeBuoyIcon, label: "Support", to: "/expert/support" },
			],
			label: "Business",
		},
	],
};

function isCurrentPath(pathname: string, target: string) {
	if (["/admin", "/client", "/expert"].includes(target)) {
		return pathname === target || pathname === `${target}/`;
	}
	return pathname === target || pathname.startsWith(`${target}/`);
}

export function PageShell({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();
	const { setTheme, theme } = useTheme();
	const pathname = useRouterState({
		select: (state) => state.location.pathname,
	});
	const { data: user } = useCurrentUser();
	const signOutMutation = useSignOut();
	const groups = user ? navigation[user.primaryRole] : [];
	const items = groups.flatMap((group) => group.items);
	const currentItem = items.find((item) => isCurrentPath(pathname, item.to));
	const currentLabel = pathname.startsWith("/client/profile")
		? "Profile"
		: pathname.startsWith("/client/summaries")
			? "Session summary"
			: pathname.startsWith("/expert/profile")
				? "Expert profile"
				: pathname.startsWith("/expert/sessions/")
					? "Session room"
					: (currentItem?.label ?? "Workspace");
	const profilePath =
		user?.primaryRole === "client"
			? "/client/profile"
			: user?.primaryRole === "expert"
				? "/expert/profile"
				: null;
	const settingsPath = user ? `/${user.primaryRole}/settings` : null;

	async function handleSignOut() {
		await signOutMutation.mutateAsync();
		await navigate({ to: "/" });
	}

	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader className="p-3 group-data-[collapsible=icon]:p-2">
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton asChild size="lg" tooltip="Laxiriir Expert">
								<Link to="/">
									<span className="flex aspect-square size-10 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground shadow-xs">
										<WaypointsIcon />
									</span>
									<span className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
										<span className="truncate font-semibold">
											Laxiriir Expert
										</span>
										<span className="truncate text-sidebar-foreground/60 text-xs capitalize">
											{user?.primaryRole ?? "Consultations"} workspace
										</span>
									</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent>
					{groups.map((group) => (
						<SidebarGroup
							className="px-3 py-2 group-data-[collapsible=icon]:p-2"
							key={group.label}
						>
							<SidebarGroupLabel>{group.label}</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu className="gap-1">
									{group.items.map((item) => {
										const Icon = item.icon;
										return (
											<SidebarMenuItem key={item.to}>
												<SidebarMenuButton
													asChild
													isActive={isCurrentPath(pathname, item.to)}
													tooltip={item.label}
												>
													<Link to={item.to}>
														<Icon />
														<span>{item.label}</span>
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					))}
				</SidebarContent>

				<SidebarFooter className="border-sidebar-border/80 border-t p-3 group-data-[collapsible=icon]:p-2">
					<SidebarMenu>
						<SidebarMenuItem>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<SidebarMenuButton
										className="group-data-[collapsible=icon]:justify-center"
										size="lg"
									>
										<Avatar>
											<AvatarFallback>
												{user?.displayName.slice(0, 2).toUpperCase() ?? "LX"}
											</AvatarFallback>
										</Avatar>
										<span className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
											<span className="truncate font-medium">
												{user?.displayName ?? "Laxiriir user"}
											</span>
											<span className="truncate text-xs">{user?.email}</span>
										</span>
										<ChevronsUpDownIcon className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
									</SidebarMenuButton>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="min-w-64 rounded-lg"
									side="right"
									sideOffset={4}
								>
									<DropdownMenuLabel className="font-normal">
										<p className="font-medium text-sm">{user?.displayName}</p>
										<p className="truncate text-muted-foreground text-xs">
											{user?.email}
										</p>
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										{profilePath ? (
											<DropdownMenuItem asChild>
												<Link to={profilePath}>
													<UserRoundIcon />
													Profile
												</Link>
											</DropdownMenuItem>
										) : null}
										{settingsPath ? (
											<DropdownMenuItem asChild>
												<Link to={settingsPath}>
													<SettingsIcon />
													Settings
												</Link>
											</DropdownMenuItem>
										) : null}
										<DropdownMenuSub>
											<DropdownMenuSubTrigger>
												<SunMoonIcon />
												Appearance
											</DropdownMenuSubTrigger>
											<DropdownMenuSubContent>
												<DropdownMenuRadioGroup
													onValueChange={setTheme}
													value={theme ?? "system"}
												>
													<DropdownMenuRadioItem value="light">
														<SunIcon />
														Light
													</DropdownMenuRadioItem>
													<DropdownMenuRadioItem value="dark">
														<MoonIcon />
														Dark
													</DropdownMenuRadioItem>
													<DropdownMenuRadioItem value="system">
														<MonitorIcon />
														System
													</DropdownMenuRadioItem>
												</DropdownMenuRadioGroup>
											</DropdownMenuSubContent>
										</DropdownMenuSub>
									</DropdownMenuGroup>
									<DropdownMenuSeparator />
									<DropdownMenuGroup>
										<DropdownMenuItem
											disabled={signOutMutation.isPending}
											onSelect={() => void handleSignOut()}
											variant="destructive"
										>
											{signOutMutation.isPending ? <Spinner /> : <LogOutIcon />}
											Sign out
										</DropdownMenuItem>
									</DropdownMenuGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/90 px-6 backdrop-blur-sm">
					<SidebarTrigger className="-ml-1" />
					<Separator className="mr-2 h-4!" orientation="vertical" />
					<p className="font-medium text-sm">{currentLabel}</p>
				</header>
				<div className="flex flex-1 flex-col p-5 pt-7 lg:p-8">{children}</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
