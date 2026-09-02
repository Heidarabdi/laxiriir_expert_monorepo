import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";

export function PlannedFeature({
	backLabel = "Back to dashboard",
	backTo = "/client",
	description,
	icon: Icon,
	title,
}: {
	backLabel?: string;
	backTo?: "/admin" | "/client" | "/expert" | "/expert/sessions";
	description: string;
	icon: LucideIcon;
	title: string;
}) {
	return (
		<Empty className="min-h-96 border bg-card">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Icon />
				</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button asChild variant="outline">
					<Link to={backTo}>{backLabel}</Link>
				</Button>
			</EmptyContent>
		</Empty>
	);
}
