import { createFileRoute, Link } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth-card";
import { RegisterForm } from "@/components/auth-forms";

export const Route = createFileRoute("/register")({ component: RegisterPage });

function RegisterPage() {
	return (
		<AuthCard
			className="max-w-[480px]"
			description="Join Laxiriir to consult experts or grow your practice"
			footer={
				<p className="w-full text-center text-muted-foreground text-sm">
					Already have an account?{" "}
					<Link
						className="font-medium text-primary hover:underline"
						to="/login"
					>
						Log In
					</Link>
				</p>
			}
			title="Create your account"
		>
			<RegisterForm />
		</AuthCard>
	);
}
