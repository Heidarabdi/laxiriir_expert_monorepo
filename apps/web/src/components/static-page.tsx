import { PublicShell } from "@/components/public-shell";

export function StaticPage({
	children,
	eyebrow,
	title,
}: {
	children: React.ReactNode;
	eyebrow: string;
	title: string;
}) {
	return (
		<PublicShell>
			<main className="mx-auto min-h-[65svh] max-w-3xl px-4 py-20 sm:px-6">
				<p className="mb-3 font-medium text-muted-foreground text-sm uppercase tracking-[0.2em]">
					{eyebrow}
				</p>
				<h1 className="text-balance font-semibold text-4xl tracking-tight sm:text-5xl">
					{title}
				</h1>
				<div className="mt-8 space-y-5 text-lg text-muted-foreground leading-8">
					{children}
				</div>
			</main>
		</PublicShell>
	);
}
