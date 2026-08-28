import { createFileRoute, Link } from "@tanstack/react-router";

import { PublicShell } from "@/components/public-shell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExperts } from "@/hooks/use-consultations";
import { formatPrice } from "@/lib/format";

export const Route = createFileRoute("/experts/")({
	component: ExpertsPage,
	head: () => ({ meta: [{ title: "Experts | Laxiriir Expert" }] }),
});
function ExpertsPage() {
	const query = useExperts();
	const experts = query.data?.experts ?? [];
	return (
		<PublicShell>
			<main className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
				<div className="mb-10 max-w-2xl">
					<p className="font-medium text-muted-foreground text-sm uppercase tracking-[0.2em]">
						Directory
					</p>
					<h1 className="mt-3 font-semibold text-4xl tracking-tight">
						Approved experts
					</h1>
					<p className="mt-4 text-muted-foreground">
						Explore live expert profiles and their current consultation
						availability.
					</p>
				</div>
				{query.isError ? (
					<Alert variant="destructive">
						<AlertTitle>Unable to load experts</AlertTitle>
						<AlertDescription>{query.error.message}</AlertDescription>
					</Alert>
				) : null}
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{query.isPending
						? [1, 2, 3].map((item) => <Skeleton className="h-72" key={item} />)
						: experts.map((expert) => (
								<Card key={expert.id}>
									<CardHeader>
										<div className="flex items-center gap-3">
											<Avatar size="lg">
												<AvatarImage src={expert.avatarUrl} />
												<AvatarFallback>
													{expert.displayName.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
											<div>
												<CardTitle>{expert.displayName}</CardTitle>
												<p className="text-muted-foreground text-sm">
													{expert.title}
												</p>
											</div>
										</div>
									</CardHeader>
									<CardContent>
										<Badge variant="secondary">{expert.category}</Badge>
										<p className="mt-4 line-clamp-3 text-muted-foreground text-sm">
											{expert.bio}
										</p>
									</CardContent>
									<CardFooter className="justify-between">
										<p className="font-medium">
											{formatPrice(expert.hourlyRateCents)}
										</p>
										<Button asChild>
											<Link params={{ id: expert.id }} to="/experts/$id">
												View profile
											</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
				</div>
				{!query.isPending && experts.length === 0 ? (
					<p className="rounded-xl border border-dashed p-12 text-center text-muted-foreground">
						No approved experts are available yet.
					</p>
				) : null}
			</main>
		</PublicShell>
	);
}
