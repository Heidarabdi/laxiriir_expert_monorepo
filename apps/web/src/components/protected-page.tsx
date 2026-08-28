import type { PrimaryRole } from "@repo/contracts/auth";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-auth";
import { getAuthRedirectPath, userHasRole } from "@/lib/auth";

interface ProtectedPageProps {
	children: React.ReactNode;
	requireApprovedExpert?: boolean;
	roles: PrimaryRole[];
}

export function ProtectedPage({
	children,
	requireApprovedExpert = false,
	roles,
}: ProtectedPageProps) {
	const navigate = useNavigate();
	const userQuery = useCurrentUser();
	const user = userQuery.data;

	useEffect(() => {
		if (userQuery.isPending) return;
		if (!user) {
			void navigate({ to: "/login" });
			return;
		}
		if (!user.emailVerified) {
			void navigate({
				search: { email: user.email, token: "" },
				to: "/verify-email",
			});
			return;
		}
		if (!userHasRole(user, roles)) {
			void navigate({ to: getAuthRedirectPath(user) });
			return;
		}
		if (requireApprovedExpert && user.expertStatus !== "approved") {
			void navigate({ to: "/expert/pending" });
		}
	}, [navigate, requireApprovedExpert, roles, user, userQuery.isPending]);

	if (userQuery.isPending) {
		return (
			<div className="flex min-h-svh items-center justify-center gap-2 text-muted-foreground">
				<Spinner />
				Loading your workspace…
			</div>
		);
	}

	if (userQuery.isError) {
		return (
			<main className="mx-auto flex min-h-svh max-w-xl items-center p-6">
				<Alert variant="destructive">
					<AlertTitle>Unable to load your account</AlertTitle>
					<AlertDescription>{userQuery.error.message}</AlertDescription>
				</Alert>
			</main>
		);
	}

	if (
		!user?.emailVerified ||
		!userHasRole(user, roles) ||
		(requireApprovedExpert && user.expertStatus !== "approved")
	) {
		return null;
	}

	return children;
}
