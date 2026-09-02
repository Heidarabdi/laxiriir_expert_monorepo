import type { PrimaryRole } from "@repo/contracts/auth";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	LayoutDashboardIcon,
	LogOutIcon,
	MenuIcon,
	MonitorIcon,
	MoonIcon,
	SettingsIcon,
	SunIcon,
	SunMoonIcon,
	UserRoundIcon,
	VideoIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser, useSignOut } from "@/hooks/use-auth";

const publicLinks = [
	{ label: "Find Experts", to: "/experts" },
	{ label: "Pricing", to: "/pricing" },
	{ label: "About", to: "/about" },
	{ label: "FAQ", to: "/faq" },
	{ label: "Contact", to: "/contact" },
] as const;

function dashboardPath(role: PrimaryRole) {
	switch (role) {
		case "admin":
			return "/admin" as const;
		case "expert":
			return "/expert" as const;
		case "client":
			return "/client" as const;
	}
}

function profilePath(role: PrimaryRole) {
	switch (role) {
		case "admin":
			return "/admin/settings" as const;
		case "expert":
			return "/expert/profile" as const;
		case "client":
			return "/client/profile" as const;
	}
}

function settingsPath(role: PrimaryRole) {
	switch (role) {
		case "admin":
			return "/admin/settings" as const;
		case "expert":
			return "/expert/settings" as const;
		case "client":
			return "/client/settings" as const;
	}
}

function Brand() {
	return (
		<Link
			className="flex shrink-0 items-center gap-2.5 font-bold text-lg"
			to="/"
		>
			<span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
				<VideoIcon />
			</span>
			<span>Laxiriir.expert</span>
		</Link>
	);
}

function ThemeMenu() {
	const { setTheme, theme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label="Change theme"
					className="size-9 rounded-full"
					size="icon-sm"
					variant="secondary"
				>
					<SunMoonIcon />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-40">
				<DropdownMenuLabel>Appearance</DropdownMenuLabel>
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
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function UserMenu() {
	const navigate = useNavigate();
	const { data: user, isPending } = useCurrentUser();
	const signOutMutation = useSignOut();

	async function handleSignOut() {
		await signOutMutation.mutateAsync();
		await navigate({ to: "/" });
	}

	if (isPending) return <Skeleton className="size-9 rounded-full" />;
	if (!user) {
		return (
			<>
				<Button asChild size="sm" variant="outline">
					<Link to="/login">Log In</Link>
				</Button>
				<Button asChild className="hidden sm:inline-flex" size="sm">
					<Link to="/register">
						Get Started
						<ArrowRightIcon data-icon="inline-end" />
					</Link>
				</Button>
			</>
		);
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					aria-label={`Open ${user.displayName}'s account menu`}
					className="rounded-full"
					size="icon-sm"
					variant="ghost"
				>
					<Avatar>
						<AvatarFallback>
							{user.displayName.slice(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="min-w-64">
				<DropdownMenuLabel className="font-normal">
					<p className="font-medium text-sm">{user.displayName}</p>
					<p className="truncate text-muted-foreground text-xs">{user.email}</p>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<Link to={dashboardPath(user.primaryRole)}>
							<LayoutDashboardIcon />
							Dashboard
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to={profilePath(user.primaryRole)}>
							<UserRoundIcon />
							Profile
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link to={settingsPath(user.primaryRole)}>
							<SettingsIcon />
							Settings
						</Link>
					</DropdownMenuItem>
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
	);
}

function MobileNavigation() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					aria-label="Open navigation"
					className="lg:hidden"
					size="icon-sm"
					variant="ghost"
				>
					<MenuIcon />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Navigation</SheetTitle>
					<SheetDescription>Explore Laxiriir Expert.</SheetDescription>
				</SheetHeader>
				<nav className="flex flex-col gap-1 px-4">
					{publicLinks.map((item) => (
						<SheetClose asChild key={item.to}>
							<Button asChild className="justify-start" variant="ghost">
								<Link to={item.to}>{item.label}</Link>
							</Button>
						</SheetClose>
					))}
				</nav>
			</SheetContent>
		</Sheet>
	);
}

export function PublicShell({
	children,
	landingVariant,
}: {
	children: React.ReactNode;
	landingVariant?: "revised";
}) {
	return (
		<div
			className="public-shell min-h-svh bg-background text-foreground"
			data-landing={landingVariant}
		>
			{landingVariant === "revised" && (
				<a
					href="#main-content"
					className="sr-only focus:not-sr-only focus:block focus:bg-background focus:p-4 focus:text-primary"
				>
					Skip to content
				</a>
			)}
			<header className="border-b bg-surface">
				<div className="mx-auto flex h-18 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-0">
					<Brand />
					<nav className="mx-auto hidden items-center gap-8 font-medium text-muted-foreground text-sm lg:flex">
						{publicLinks.map((item) => (
							<Link
								className="transition-colors hover:text-foreground"
								key={item.to}
								to={item.to}
							>
								{item.label}
							</Link>
						))}
					</nav>
					<div className="ml-auto flex items-center gap-3 lg:ml-0">
						<ThemeMenu />
						<UserMenu />
						<MobileNavigation />
					</div>
				</div>
			</header>
			{children}
			<footer className="border-t bg-background">
				<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-0">
					<div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
						<div className="flex max-w-xl flex-col gap-3">
							<p className="font-extrabold text-xl">Laxiriir.expert</p>
							<p className="text-muted-foreground text-sm leading-6">
								{landingVariant === "revised"
									? "A place to find expert perspectives, make time for a conversation, and take your next step."
									: "The video-first professional consultation platform engineered for secure, verified sessions worldwide."}
							</p>
						</div>
						<FooterColumn
							links={[
								["Find Experts", "/experts"],
								["Browse Categories", "/experts"],
								["Pricing Plans", "/pricing"],
								["FAQ", "/faq"],
							]}
							title="Platform"
						/>
						<FooterColumn
							links={[
								["About Us", "/about"],
								["Contact Support", "/contact"],
								["Expert Application", "/register"],
								["Trust & Safety", "/about"],
							]}
							title="Company"
						/>
						<FooterColumn
							links={
								landingVariant === "revised"
									? [
											["Privacy Policy", "/privacy"],
											["Terms of Service", "/terms"],
										]
									: [
											["Privacy Policy", "/privacy"],
											["Terms of Service", "/terms"],
											["Escrow Agreement", "/terms"],
											["Cookie Settings", "/privacy"],
										]
							}
							title="Legal"
						/>
					</div>
					<div className="mt-12 flex flex-col gap-3 border-t pt-5 text-muted-foreground text-xs sm:flex-row sm:items-center sm:justify-between">
						<p>© 2026 Laxiriir Expert Inc. All rights reserved.</p>
						{landingVariant !== "revised" && (
							<p className="flex items-center gap-2">
								<span className="size-1.5 rounded-full bg-accent-foreground" />
								Systems Operational
							</p>
						)}
					</div>
				</div>
			</footer>
		</div>
	);
}

function FooterColumn({
	links,
	title,
}: {
	links: ReadonlyArray<readonly [string, string]>;
	title: string;
}) {
	return (
		<div className="flex flex-col gap-3 text-sm">
			<p className="font-bold text-xs uppercase tracking-wider">{title}</p>
			{links.map(([label, to]) => (
				<Link
					className="text-muted-foreground hover:text-foreground"
					key={label}
					to={to}
				>
					{label}
				</Link>
			))}
		</div>
	);
}
