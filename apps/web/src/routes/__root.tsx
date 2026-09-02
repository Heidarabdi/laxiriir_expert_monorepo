import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClientProvider } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { ThemeProvider } from "next-themes";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { RouterContext } from "@/router";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<RouterContext>()({
	component: RootApplication,
	head: () => ({
		links: [{ href: appCss, rel: "stylesheet" }],
		meta: [
			{ charSet: "utf-8" },
			{
				content: "width=device-width, initial-scale=1",
				name: "viewport",
			},
			{
				content:
					"Discover approved experts, reserve real availability, and manage consultations in one focused workspace.",
				name: "description",
			},
			{ content: "Laxiriir Expert", property: "og:site_name" },
			{ content: "website", property: "og:type" },
			{ content: "summary", name: "twitter:card" },
			{ title: "Laxiriir Expert" },
		],
	}),
	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function RootApplication() {
	const { queryClient } = Route.useRouteContext();

	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			disableTransitionOnChange
			enableSystem
		>
			<QueryClientProvider client={queryClient}>
				<TooltipProvider>
					<Outlet />
					<Toaster richColors />
				</TooltipProvider>
			</QueryClientProvider>
		</ThemeProvider>
	);
}

function NotFound() {
	return (
		<main className="flex min-h-svh items-center justify-center p-6">
			<div className="flex max-w-md flex-col items-center gap-4 text-center">
				<p className="font-medium text-muted-foreground text-sm">404</p>
				<h1 className="font-semibold text-3xl tracking-tight">
					Page not found
				</h1>
				<p className="text-muted-foreground">
					The page you requested does not exist or has moved.
				</p>
				<Button asChild>
					<Link to="/">Return home</Link>
				</Button>
			</div>
		</main>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body className="antialiased" suppressHydrationWarning>
				{children}
				{import.meta.env.DEV ? (
					<TanStackDevtools
						config={{ position: "bottom-right" }}
						plugins={[
							{
								name: "TanStack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
						]}
					/>
				) : null}
				<Scripts />
			</body>
		</html>
	);
}
