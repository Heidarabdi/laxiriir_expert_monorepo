import type { PublicRegistrationRole } from "@repo/contracts/auth";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import {
	BriefcaseBusinessIcon,
	CheckCircle2Icon,
	CheckIcon,
	GlobeIcon,
	MailIcon,
	UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
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

function GitHubMark() {
	return (
		<svg aria-hidden="true" viewBox="0 0 24 24">
			<path
				d="M12 .7a12 12 0 0 0-3.79 23.38c.6.11.82-.26.82-.58v-2.24c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.69.83.57A12 12 0 0 0 12 .7Z"
				fill="currentColor"
			/>
		</svg>
	);
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
			<FieldGroup className="gap-4">
				<Field className="gap-3" orientation="horizontal">
					<Button
						className="h-10 flex-1"
						onClick={() => toast.info("Google sign-in is not configured yet.")}
						type="button"
						variant="outline"
					>
						<GlobeIcon data-icon="inline-start" />
						Google
					</Button>
					<Button
						className="h-10 flex-1"
						onClick={() => toast.info("GitHub sign-in is not configured yet.")}
						type="button"
						variant="outline"
					>
						<GitHubMark />
						GitHub
					</Button>
				</Field>
				<FieldSeparator />
				<form.Field name="email">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Email address</FieldLabel>
							<Input
								autoComplete="email"
								className="h-10"
								id={field.name}
								onBlur={field.handleBlur}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								placeholder="name@example.com"
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
								className="h-10"
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
				<Button
					className="h-[42px] w-full"
					disabled={mutation.isPending}
					type="submit"
				>
					{mutation.isPending ? <Spinner data-icon="inline-start" /> : null}
					Sign In
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
			terms: true,
		},
		onSubmit: async ({ value }) => {
			const { terms: _terms, ...registration } = value;
			const user = await mutation.mutateAsync(registration);
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
			<FieldGroup className="gap-3.5">
				<form.Field name="role">
					{(field) => (
						<Field>
							<ToggleGroup
								className="grid w-full grid-cols-2 items-stretch"
								onValueChange={(value) => {
									if (value) {
										field.handleChange(value as PublicRegistrationRole);
									}
								}}
								spacing={3}
								type="single"
								value={field.state.value}
								variant="outline"
							>
								<ToggleGroupItem
									className="h-auto min-w-0 flex-col items-start gap-1 p-3 text-left"
									value="client"
								>
									<span className="flex w-full items-center gap-1.5 font-semibold">
										<UserIcon />
										Client
										{field.state.value === "client" ? (
											<CheckIcon className="ml-auto" />
										) : null}
									</span>
									<span className="text-muted-foreground text-xs">
										Book consultations &amp; get advice
									</span>
								</ToggleGroupItem>
								<ToggleGroupItem
									className="h-auto min-w-0 flex-col items-start gap-1 p-3 text-left"
									value="expert"
								>
									<span className="flex w-full items-center gap-1.5 font-semibold">
										<BriefcaseBusinessIcon />
										Verified Expert
										{field.state.value === "expert" ? (
											<CheckIcon className="ml-auto" />
										) : null}
									</span>
									<span className="text-muted-foreground text-xs">
										Offer sessions &amp; earn fees
									</span>
								</ToggleGroupItem>
							</ToggleGroup>
						</Field>
					)}
				</form.Field>
				<form.Field name="name">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Full name</FieldLabel>
							<Input
								autoComplete="name"
								className="h-10"
								id={field.name}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								placeholder="Sarah Jensen"
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
								className="h-10"
								id={field.name}
								onChange={(event) => field.handleChange(event.target.value)}
								required
								placeholder="sarah@example.com"
								type="email"
								value={field.state.value}
							/>
						</Field>
					)}
				</form.Field>
				<form.Field name="password">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Create Password</FieldLabel>
							<Input
								autoComplete="new-password"
								className="h-10"
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
				<form.Field name="terms">
					{(field) => (
						<Field className="gap-2" orientation="horizontal">
							<Checkbox
								checked={field.state.value}
								id={field.name}
								onCheckedChange={(checked) =>
									field.handleChange(checked === true)
								}
								required
							/>
							<FieldLabel
								className="font-normal text-muted-foreground text-xs"
								htmlFor={field.name}
							>
								I agree to the Terms of Service and Privacy Policy
							</FieldLabel>
						</Field>
					)}
				</form.Field>
				{mutation.isError ? (
					<FieldError>
						{messageFrom(mutation.error, "Unable to create account.")}
					</FieldError>
				) : null}
				<Button
					className="h-[42px] w-full"
					disabled={mutation.isPending}
					type="submit"
				>
					{mutation.isPending ? <Spinner data-icon="inline-start" /> : null}
					Create Account
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
