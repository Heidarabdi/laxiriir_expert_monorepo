import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDaysIcon } from "lucide-react";

import { PublicShell } from "@/components/public-shell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useExpertAvailability, useExperts } from "@/hooks/use-consultations";
import { formatPrice, formatTimeRange } from "@/lib/format";

export const Route = createFileRoute("/experts/$id")({
	component: ExpertProfilePage,
});
function ExpertProfilePage() {
	const { id } = Route.useParams();
	const expertsQuery = useExperts();
	const availabilityQuery = useExpertAvailability(id);
	const expert = expertsQuery.data?.experts.find((item) => item.id === id);
	return (
		<PublicShell>
			<main className="mx-auto min-h-[70svh] max-w-5xl px-4 py-16 sm:px-6">
				{expertsQuery.isPending ? (
					<Skeleton className="h-72" />
				) : !expert ? (
					<Card>
						<CardHeader>
							<CardTitle>Expert not found</CardTitle>
						</CardHeader>
						<CardContent>
							<Button asChild>
								<Link to="/experts">Back to experts</Link>
							</Button>
						</CardContent>
					</Card>
				) : (
					<div className="grid gap-6 lg:grid-cols-[1fr_360px]">
						<Card>
							<CardHeader>
								<div className="flex items-center gap-4">
									<Avatar size="lg">
										<AvatarImage src={expert.avatarUrl} />
										<AvatarFallback>
											{expert.displayName.slice(0, 2)}
										</AvatarFallback>
									</Avatar>
									<div>
										<Badge variant="secondary">{expert.category}</Badge>
										<CardTitle className="mt-2 text-3xl">
											{expert.displayName}
										</CardTitle>
										<p className="text-muted-foreground">{expert.title}</p>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground leading-7">{expert.bio}</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Available times</CardTitle>
								<p className="font-medium">
									{formatPrice(expert.hourlyRateCents)} per session
								</p>
							</CardHeader>
							<CardContent className="flex flex-col gap-2">
								{availabilityQuery.isPending ? (
									<Skeleton className="h-32" />
								) : (
									availabilityQuery.data?.slots.map((slot) => (
										<Button
											asChild
											className="h-auto justify-start py-3"
											key={slot.id}
											variant="outline"
										>
											<Link to="/login">
												<CalendarDaysIcon data-icon="inline-start" />
												<span className="text-left">
													<span className="block">
														{new Date(slot.startsAt).toLocaleDateString()}
													</span>
													<span className="text-muted-foreground text-xs">
														{formatTimeRange(slot.startsAt, slot.endsAt)}
													</span>
												</span>
											</Link>
										</Button>
									))
								)}
								{!availabilityQuery.isPending &&
								availabilityQuery.data?.slots.length === 0 ? (
									<p className="text-muted-foreground text-sm">
										No open times right now.
									</p>
								) : null}
							</CardContent>
						</Card>
					</div>
				)}
			</main>
		</PublicShell>
	);
}
