import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";
import { ResetPasswordForm } from "@/components/auth-forms";

export const Route = createFileRoute("/reset-password")({
	component: ResetPasswordPage,
	validateSearch: (search: Record<string, unknown>) => ({
		token: typeof search.token === "string" ? search.token : "",
	}),
});
function ResetPasswordPage() {
	const { token } = Route.useSearch();
	return (
		<AuthCard
			description="Choose a new password for your account."
			title="New password"
		>
			<ResetPasswordForm token={token} />
		</AuthCard>
	);
}
