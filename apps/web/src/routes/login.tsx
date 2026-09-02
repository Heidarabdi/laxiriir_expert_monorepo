import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";
import { LoginForm } from "@/components/auth-forms";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
	return (
		<AuthCard
			description="Enter your credentials to access your account"
			footer={
				<p className="w-full text-center text-muted-foreground text-sm">
					Don&apos;t have an account?{" "}
					<Link
						className="font-medium text-primary hover:underline"
						to="/register"
					>
						Create an account
					</Link>
				</p>
			}
			title="Welcome back"
		>
			<LoginForm />
		</AuthCard>
	);
}
