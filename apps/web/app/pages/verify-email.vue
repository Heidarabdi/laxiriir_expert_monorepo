<template>
	<AuthCardLayout
		:description="pageDescription"
		eyebrow="Email verification"
		size="wide"
		title="Verify your email"
	>
		<div class="space-y-6">
			<div class="rounded-2xl border border-border/50 bg-secondary/60 px-5 py-5">
				<p class="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">
					Account details
				</p>
				<div class="mt-4 grid gap-4 md:grid-cols-2">
					<div>
						<p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">
							Email
						</p>
						<p class="mt-2 font-semibold text-foreground">{{ email }}</p>
					</div>
					<div>
						<p class="text-xs uppercase tracking-[0.2em] text-muted-foreground">
							Role
						</p>
						<p class="mt-2 font-semibold capitalize text-foreground">{{ role }}</p>
					</div>
				</div>
			</div>

			<div class="rounded-2xl border border-primary/20 bg-primary/10 px-5 py-5">
				<p class="text-sm leading-7 text-muted-foreground">
					<template v-if="isVerified">
						Your email has been verified successfully. You can now continue into the product.
					</template>
					<template v-else>
						We have sent a verification link to
						<span class="font-semibold text-foreground">{{ email }}</span>.
						Open that link to complete account setup and unlock your dashboard access.
					</template>
				</p>
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<Button
					:disabled="isVerified || isResending"
					class="shadow-[0_0_20px_rgb(var(--primary-rgb)_/_0.2)]"
					size="lg"
					type="button"
					@click="resendEmail"
				>
					{{
						isVerified
							? "Email verified"
							: isResending
								? "Resending..."
								: "Resend verification email"
					}}
				</Button>
				<NuxtLink
					class="inline-flex items-center justify-center rounded-xl border border-border/60 px-4 py-3 text-sm font-semibold transition hover:border-primary/40 hover:bg-secondary"
					:to="isVerified ? continuePath : '/login'"
				>
					{{ isVerified ? "Continue" : "Back to login" }}
				</NuxtLink>
			</div>

			<p v-if="resent" class="text-sm text-primary">
				A fresh verification email has been queued for delivery.
			</p>
			<p v-if="errorMessage" class="text-sm text-destructive">
				{{ errorMessage }}
			</p>
		</div>
	</AuthCardLayout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getAuthRedirectPath, type PrimaryRole } from "~/lib/auth";
import AuthCardLayout from "~/components/auth/AuthCardLayout.vue";
import { Button } from "@/components/ui/button";

definePageMeta({
	layout: false,
});

useSeoMeta({
	description: "Verify your email to activate your Laxiriir Expert account.",
	title: "Verify Email | Laxiriir Expert",
});

const route = useRoute();
const auth = useAuthStore();
await auth.ensureLoaded();

const email = computed(() =>
	auth.user?.email ??
	(typeof route.query.email === "string" ? route.query.email : "you@example.com"),
);
const role = computed(() =>
	(auth.user?.primaryRole ??
		(typeof route.query.role === "string" ? route.query.role : "client")) as PrimaryRole,
);
const isVerified = computed(
	() => route.query.verified === "1" || auth.user?.emailVerified === true,
);
const continuePath = computed(() =>
	auth.user ? getAuthRedirectPath(auth.user) : "/login",
);
const pageDescription = computed(() =>
	isVerified.value
		? "Your email is verified. Continue into the product."
		: "Check your inbox to verify your email and activate the right account access for your role.",
);

const isResending = ref(false);
const resent = ref(false);
const errorMessage = ref("");

if (import.meta.client && typeof route.query.token === "string" && route.query.token) {
	try {
		await auth.verifyEmailToken(route.query.token);
		await navigateTo({
			path: "/verify-email",
			query: {
				email: email.value,
				role: role.value,
				verified: "1",
			},
		}, { replace: true });
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to verify your email.";
	}
}

async function resendEmail() {
	isResending.value = true;
	errorMessage.value = "";
	try {
		await auth.resendVerificationEmail(email.value, role.value);
		resent.value = true;
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to resend verification email.";
	} finally {
		isResending.value = false;
	}
}
</script>
