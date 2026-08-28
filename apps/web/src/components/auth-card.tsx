import { Link } from "@tanstack/react-router";
import { ShieldCheckIcon } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface AuthCardProps {
	children: React.ReactNode;
	description: string;
	footer?: React.ReactNode;
	title: string;
}

export function AuthCard({
	children,
	description,
	footer,
	title,
}: AuthCardProps) {
	return (
		<main className="flex min-h-svh items-center justify-center bg-muted/40 p-4">
			<div className="flex w-full max-w-md flex-col gap-5">
				<Link
					className="flex items-center justify-center gap-2 font-semibold"
					to="/"
				>
					<ShieldCheckIcon className="size-5 text-primary" />
					Laxiriir Expert
				</Link>
				<Card>
					<CardHeader>
						<CardTitle>{title}</CardTitle>
						<CardDescription>{description}</CardDescription>
					</CardHeader>
					<CardContent>{children}</CardContent>
					{footer ? <CardFooter>{footer}</CardFooter> : null}
				</Card>
			</div>
		</main>
	);
}
