import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

import { RevisedLanding } from "@/components/landing/revised-landing";
import { Button } from "@/components/ui/button";

// Keep the previous design for local comparison, out of the production bundle.
const PenLanding = import.meta.env.DEV
	? lazy(() =>
			import("@/components/landing/pen-landing").then((module) => ({
				default: module.PenLanding,
			})),
		)
	: null;

export const Route = createFileRoute("/")({
	validateSearch: (
		search: Record<string, unknown>,
	): { design?: "pen" | "revised" } => ({
		design:
			search.design === "pen" || search.design === "revised"
				? search.design
				: undefined,
	}),
	component: Home,
	head: () => ({
		meta: [
			{
				title: "Laxiriir Expert | Find the right expert for your next decision",
			},
			{
				name: "description",
				content:
					"Compare expert profiles, explore available times, and manage your consultations in one place.",
			},
			{
				property: "og:title",
				content: "Laxiriir Expert | Good advice. Clearer decisions.",
			},
		],
	}),
});

function Home() {
	const { design } = Route.useSearch();
	return (
		<>
			{import.meta.env.DEV && design && (
				<nav
					aria-label="Landing design comparison"
					className="flex flex-wrap items-center justify-center gap-2 border-b bg-background px-4 py-2 text-sm"
				>
					<span className="mr-2 text-muted-foreground">
						Local design preview
					</span>
					<Button
						asChild
						size="sm"
						variant={design === "revised" ? "default" : "outline"}
					>
						<Link
							to="/"
							search={{ design: "revised" }}
							aria-current={design === "revised" ? "page" : undefined}
						>
							Revised
						</Link>
					</Button>
					<Button
						asChild
						size="sm"
						variant={design === "pen" ? "default" : "outline"}
					>
						<Link
							to="/"
							search={{ design: "pen" }}
							aria-current={design === "pen" ? "page" : undefined}
						>
							Original Pen design
						</Link>
					</Button>
				</nav>
			)}
			{design === "pen" && PenLanding ? (
				<Suspense
					fallback={
						<p role="status" className="p-8 text-center">
							Loading the original design…
						</p>
					}
				>
					<PenLanding />
				</Suspense>
			) : (
				<RevisedLanding />
			)}
		</>
	);
}
