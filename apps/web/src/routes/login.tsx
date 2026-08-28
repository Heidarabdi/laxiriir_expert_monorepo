import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";
import { LoginForm } from "@/components/auth-forms";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
	return (
		<AuthCard
			description="Sign in to manage consultations and availability."
			footer={
				<p className="w-full text-center text-muted-foreground text-sm">
					No account?{" "}
					<Link
						className="font-medium text-primary hover:underline"
						to="/register"
					>
						Create one
					</Link>
				</p>
			}
			title="Welcome back"
		>
			<LoginForm />
		</AuthCard>
	);
}
