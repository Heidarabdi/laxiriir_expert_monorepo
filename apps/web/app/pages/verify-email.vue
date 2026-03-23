<template>
	<AuthCardLayout
		description="Check your inbox to verify your email and activate the right account access for your role."
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
					We have sent a verification link to
					<span class="font-semibold text-foreground">{{ email }}</span>.
					Open that link to complete account setup and unlock your dashboard access.
				</p>
			</div>

			<div class="grid gap-3 sm:grid-cols-2">
				<Button
					:disabled="isResending"
					class="shadow-[0_0_20px_rgb(var(--primary-rgb)_/_0.2)]"
					size="lg"
					type="button"
					@click="resendEmail"
				>
					{{ isResending ? "Resending..." : "Resend verification email" }}
				</Button>
				<NuxtLink
					class="inline-flex items-center justify-center rounded-xl border border-border/60 px-4 py-3 text-sm font-semibold transition hover:border-primary/40 hover:bg-secondary"
					to="/login"
				>
					Back to login
				</NuxtLink>
			</div>

			<p v-if="resent" class="text-sm text-primary">
				A fresh verification email has been queued for delivery.
			</p>
		</div>
	</AuthCardLayout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
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
const email = computed(() =>
	typeof route.query.email === "string" ? route.query.email : "you@example.com",
);
const role = computed(() =>
	typeof route.query.role === "string" ? route.query.role : "client",
);

const isResending = ref(false);
const resent = ref(false);

async function resendEmail() {
	isResending.value = true;
	await new Promise((resolve) => setTimeout(resolve, 900));
	isResending.value = false;
	resent.value = true;
}
</script>
