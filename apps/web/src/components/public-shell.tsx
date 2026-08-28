import { Link } from "@tanstack/react-router";
import { ShieldCheckIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export function PublicShell({ children }: { children: React.ReactNode }) {
	return (
		<div className="min-h-svh bg-background">
			<header className="border-b">
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
					<Link className="flex items-center gap-2 font-semibold" to="/">
						<ShieldCheckIcon className="size-5" />
						Laxiriir Expert
					</Link>
					<nav className="hidden items-center gap-5 text-sm sm:flex">
						<Link to="/experts">Experts</Link>
						<Link to="/about">About</Link>
						<Link to="/faq">FAQ</Link>
					</nav>
					<div className="flex gap-2">
						<Button asChild size="sm" variant="ghost">
							<Link to="/login">Sign in</Link>
						</Button>
						<Button asChild size="sm">
							<Link to="/register">Get started</Link>
						</Button>
					</div>
				</div>
			</header>
			{children}
			<footer className="border-t">
				<div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 px-4 py-8 text-muted-foreground text-sm sm:flex-row sm:px-6">
					<p>© 2026 Laxiriir Expert</p>
					<div className="flex gap-4">
						<Link to="/privacy">Privacy</Link>
						<Link to="/terms">Terms</Link>
						<Link to="/contact">Contact</Link>
					</div>
				</div>
			</footer>
		</div>
	);
}
