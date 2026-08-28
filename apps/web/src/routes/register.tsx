import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";
import { RegisterForm } from "@/components/auth-forms";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
	return (
		<AuthCard
			description="Create a client or expert account."
			footer={
				<p className="w-full text-center text-muted-foreground text-sm">
					Already registered?{" "}
					<Link
						className="font-medium text-primary hover:underline"
						to="/login"
					>
						Sign in
					</Link>
				</p>
			}
			title="Get started"
		>
			<RegisterForm />
		</AuthCard>
	);
}
