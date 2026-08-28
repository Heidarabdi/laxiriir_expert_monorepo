import type { PublicRegistrationRole } from "@repo/contracts/auth";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { CheckCircle2Icon, MailIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSignIn, useSignUp } from "@/hooks/use-auth";
import {
	requestPasswordReset,
	resendVerificationEmail,
	resetPassword,
	verifyEmailToken,
} from "@/lib/api";
import { getAuthRedirectPath } from "@/lib/auth";

function messageFrom(error: unknown, fallback: string) {
	return error instanceof Error && error.message ? error.message : fallback;
}

export function LoginForm() {
	const navigate = useNavigate();
	const mutation = useSignIn();
	const form = useForm({
		defaultValues: { email: "", password: "" },
		onSubmit: async ({ value }) => {
			const user = await mutation.mutateAsync(value);
			await navigate({ to: getAuthRedirectPath(user) });
		},
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				void form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="email">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Email address</FieldLabel>
							<Input
								autoComplete="email"
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								type="email"
								value={field.state.value}
							/>
						</Field>
					)}
				</form.Field>
				<form.Field name="password">
					{(field) => (
						<Field>
							<div className="flex items-center justify-between gap-4">
								<FieldLabel htmlFor={field.name}>Password</FieldLabel>
								<Link
									className="text-primary text-xs hover:underline"
									to="/forgot-password"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								autoComplete="current-password"
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								type="password"
								value={field.state.value}
							/>
						</Field>
					)}
				</form.Field>
				{mutation.isError ? (
					<FieldError>
						{messageFrom(mutation.error, "Unable to sign in.")}
					</FieldError>
				) : null}
				<Button disabled={mutation.isPending} size="lg" type="submit">
					{mutation.isPending ? <Spinner data-icon="inline-start" /> : null}
					Sign in
				</Button>
			</FieldGroup>
		</form>
	);
}

export function RegisterForm() {
	const navigate = useNavigate();
	const mutation = useSignUp();
	const form = useForm({
		defaultValues: {
			email: "",
			name: "",
			password: "",
			role: "client" as PublicRegistrationRole,
		},
		onSubmit: async ({ value }) => {
			const user = await mutation.mutateAsync(value);
			await navigate({
				search: { email: value.email },
				to: getAuthRedirectPath(user),
			});
		},
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				void form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="name">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Full name</FieldLabel>
							<Input
								autoComplete="name"
								id={field.name}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								value={field.state.value}
							/>
						</Field>
					)}
				</form.Field>
				<form.Field name="email">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Email address</FieldLabel>
							<Input
								autoComplete="email"
								id={field.name}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								type="email"
								value={field.state.value}
							/>
						</Field>
					)}
				</form.Field>
				<form.Field name="password">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Password</FieldLabel>
							<Input
								autoComplete="new-password"
								id={field.name}
								minLength={8}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								type="password"
								value={field.state.value}
							/>
							<FieldDescription>
								Use at least eight characters.
							</FieldDescription>
						</Field>
					)}
				</form.Field>
				<form.Field name="role">
					{(field) => (
						<Field>
							<FieldLabel>Account type</FieldLabel>
							<ToggleGroup
								className="grid w-full grid-cols-2"
								onValueChange={(value) => {
									if (value)
										field.handleChange(value as PublicRegistrationRole);
								}}
								type="single"
								value={field.state.value}
								variant="outline"
							>
								<ToggleGroupItem value="client">Client</ToggleGroupItem>
								<ToggleGroupItem value="expert">Expert</ToggleGroupItem>
							</ToggleGroup>
						</Field>
					)}
				</form.Field>
				{mutation.isError ? (
					<FieldError>
						{messageFrom(mutation.error, "Unable to create account.")}
					</FieldError>
				) : null}
				<Button disabled={mutation.isPending} size="lg" type="submit">
					{mutation.isPending ? <Spinner data-icon="inline-start" /> : null}
					Create account
				</Button>
			</FieldGroup>
		</form>
	);
}

export function ForgotPasswordForm() {
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);
	const form = useForm({
		defaultValues: { email: "" },
		onSubmit: async ({ value }) => {
			setPending(true);
			setError("");
			try {
				await requestPasswordReset(value.email);
				setMessage("Check your email for a password reset link.");
			} catch (requestError) {
				setError(messageFrom(requestError, "Unable to send the reset email."));
			} finally {
				setPending(false);
			}
		},
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				void form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="email">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Email address</FieldLabel>
							<Input
								id={field.name}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								type="email"
								value={field.state.value}
							/>
						</Field>
					)}
				</form.Field>
				{error ? <FieldError>{error}</FieldError> : null}
				{message ? (
					<Alert>
						<MailIcon />
						<AlertTitle>Email sent</AlertTitle>
						<AlertDescription>{message}</AlertDescription>
					</Alert>
				) : null}
				<Button disabled={pending} type="submit">
					{pending ? <Spinner data-icon="inline-start" /> : null}Send reset link
				</Button>
			</FieldGroup>
		</form>
	);
}

export function ResetPasswordForm({ token }: { token: string }) {
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const [pending, setPending] = useState(false);
	const form = useForm({
		defaultValues: { password: "" },
		onSubmit: async ({ value }) => {
			setPending(true);
			setError("");
			try {
				await resetPassword(token, value.password);
				await navigate({ to: "/login" });
			} catch (requestError) {
				setError(messageFrom(requestError, "Unable to reset your password."));
			} finally {
				setPending(false);
			}
		},
	});

	return (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				void form.handleSubmit();
			}}
		>
			<FieldGroup>
				<form.Field name="password">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>New password</FieldLabel>
							<Input
								id={field.name}
								minLength={8}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								type="password"
								value={field.state.value}
							/>
						</Field>
					)}
				</form.Field>
				{error ? <FieldError>{error}</FieldError> : null}
				<Button disabled={pending || !token} type="submit">
					{pending ? <Spinner data-icon="inline-start" /> : null}Save password
				</Button>
			</FieldGroup>
		</form>
	);
}

export function VerifyEmailPanel({
	email,
	token,
}: {
	email: string;
	token: string;
}) {
	const navigate = useNavigate();
	const [state, setState] = useState<"idle" | "pending" | "success" | "error">(
		token ? "pending" : "idle",
	);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (!token) return;
		verifyEmailToken(token)
			.then(async () => {
				setState("success");
				setMessage("Your email is verified. You can now sign in.");
				await navigate({ to: "/login" });
			})
			.catch((error) => {
				setState("error");
				setMessage(messageFrom(error, "This verification link is invalid."));
			});
	}, [navigate, token]);

	async function resend() {
		if (!email) return;
		setState("pending");
		try {
			await resendVerificationEmail(email);
			setState("success");
			setMessage("A new verification email has been sent.");
		} catch (error) {
			setState("error");
			setMessage(messageFrom(error, "Unable to send a verification email."));
		}
	}

	return (
		<div className="flex flex-col gap-4">
			<Alert variant={state === "error" ? "destructive" : "default"}>
				{state === "pending" ? <Spinner /> : <CheckCircle2Icon />}
				<AlertTitle>
					{state === "pending" ? "Verifying" : "Email verification"}
				</AlertTitle>
				<AlertDescription>
					{message || "Open the verification link from your inbox."}
				</AlertDescription>
			</Alert>
			<Button
				disabled={!email || state === "pending"}
				onClick={resend}
				variant="outline"
			>
				Resend verification email
			</Button>
		</div>
	);
}
