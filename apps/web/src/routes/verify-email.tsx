import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";
import { VerifyEmailPanel } from "@/components/auth-forms";

export const Route = createFileRoute("/verify-email")({
	component: VerifyEmailPage,
	validateSearch: (search: Record<string, unknown>) => ({
		email: typeof search.email === "string" ? search.email : "",
		token: typeof search.token === "string" ? search.token : "",
	}),
});
function VerifyEmailPage() {
	const search = Route.useSearch();
	return (
		<AuthCard
			description="Confirm your email address to continue."
			title="Verify your email"
		>
			<VerifyEmailPanel email={search.email} token={search.token} />
		</AuthCard>
	);
}
