import { Link } from "@tanstack/react-router";
import { VideoIcon } from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
	children: React.ReactNode;
	className?: string;
	description: string;
	footer?: React.ReactNode;
	title: string;
}

export function AuthCard({
	children,
	className,
	description,
	footer,
	title,
}: AuthCardProps) {
	return (
		<main className="auth-canvas flex min-h-svh items-center justify-center p-4 py-10">
			<div className={cn("w-full max-w-[440px]", className)}>
				<Card className="gap-6 bg-surface py-9 shadow-xl [--card-spacing:--spacing(9)]">
					<CardHeader className="items-center justify-items-center gap-2 text-center">
						<Link
							aria-label="Laxiriir Expert home"
							className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
							to="/"
						>
							<VideoIcon className="size-[22px]" />
						</Link>
						<CardTitle className="text-balance font-bold text-[22px]">
							{title}
						</CardTitle>
						<CardDescription className="text-pretty">
							{description}
						</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-col gap-5">
						{children}
						{footer}
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
