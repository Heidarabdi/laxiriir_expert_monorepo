<template>
	<AuthCardLayout
		description="Create a secure account to book consultations as a client or join the platform as an expert."
		eyebrow="Create account"
		title="Get started"
	>
		<form class="space-y-4" @submit.prevent="submitForm">
			<div>
				<label class="mb-1.5 block text-sm font-medium text-foreground"
					>Full name</label
				>
				<Input
					v-model="form.fullName"
					class="h-11 border-border/50 bg-secondary/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
					placeholder="Amina Yusuf"
					type="text"
				/>
			</div>

			<div>
				<label class="mb-1.5 block text-sm font-medium text-foreground"
					>Email address</label
				>
				<Input
					v-model="form.email"
					class="h-11 border-border/50 bg-secondary/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
					placeholder="you@example.com"
					type="email"
				/>
			</div>

			<div>
				<label class="mb-1.5 block text-sm font-medium text-foreground"
					>Password</label
				>
				<Input
					v-model="form.password"
					class="h-11 border-border/50 bg-secondary/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
					placeholder="••••••••"
					type="password"
				/>
			</div>

			<div>
				<p class="mb-2 text-sm font-medium text-foreground">Account type</p>
				<div class="grid gap-3 sm:grid-cols-2">
					<button
						v-for="option in accountTypes"
						:key="option.value"
						:class="[
							'rounded-2xl border px-4 py-4 text-left transition-all',
							form.accountType === option.value
								? 'border-primary bg-primary/10'
								: 'border-border/50 bg-secondary/60 hover:border-primary/40',
						]"
						type="button"
						@click="form.accountType = option.value"
					>
						<p class="font-semibold text-foreground">{{ option.label }}</p>
						<p class="mt-1 text-xs leading-5 text-muted-foreground">
							{{ option.description }}
						</p>
					</button>
				</div>
			</div>

			<Button
				:disabled="isSubmitting"
				class="mt-6 w-full shadow-[0_0_20px_rgb(var(--primary-rgb)_/_0.2)]"
				size="lg"
				type="submit"
			>
				{{ isSubmitting ? "Creating account..." : submitLabel }}
			</Button>

			<p
				v-if="errorMessage"
				class="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
			>
				{{ errorMessage }}
			</p>
		</form>

		<template #footer>
			<div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
				<span>Already have an account?</span>
				<NuxtLink class="font-bold text-primary hover:underline" to="/login">
					Sign in
				</NuxtLink>
			</div>
		</template>
	</AuthCardLayout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { getAuthRedirectPath } from "~/lib/auth";
import AuthCardLayout from "~/components/auth/AuthCardLayout.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

definePageMeta({
	layout: false,
	middleware: "guest-only",
});

useSeoMeta({
	description: "Create a client or expert account on Laxiriir Expert.",
	title: "Sign Up | Laxiriir Expert",
});

const accountTypes = [
	{
		description: "Book sessions, manage appointments, and attend consultations.",
		label: "Client account",
		value: "client",
	},
	{
		description: "Offer consultations, manage availability, and handle payouts.",
		label: "Expert account",
		value: "expert",
	},
] as const;

const form = ref({
	accountType: "client",
	email: "",
	fullName: "",
	password: "",
});

const auth = useAuthStore();
const isSubmitting = computed(() => auth.loading);
const errorMessage = computed(() => auth.errorMessage);

const submitLabel = computed(() =>
	form.value.accountType === "expert"
		? "Create expert account"
		: "Create client account",
);

async function submitForm() {
	try {
		const user = await auth.signUp({
			email: form.value.email,
			name: form.value.fullName,
			password: form.value.password,
			role: form.value.accountType as "client" | "expert",
		});

		await navigateTo({
			path: user ? getAuthRedirectPath(user) : "/verify-email",
			query: {
				email: form.value.email || "you@example.com",
				role: form.value.accountType,
			},
		});
	} catch {
		// Error state is stored in Pinia for inline rendering.
	}
}
</script>
