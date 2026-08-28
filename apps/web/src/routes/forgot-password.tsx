import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";
import { ForgotPasswordForm } from "@/components/auth-forms";

export const Route = createFileRoute("/forgot-password")({
	component: ForgotPasswordPage,
});
function ForgotPasswordPage() {
	return (
		<AuthCard
			description="We will email you a secure reset link."
			title="Reset your password"
		>
			<ForgotPasswordForm />
		</AuthCard>
	);
}
