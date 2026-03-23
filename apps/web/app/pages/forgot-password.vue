<template>
	<AuthCardLayout
		description="Enter your email and we will send instructions to reset your password."
		eyebrow="Account recovery"
		title="Forgot your password?"
	>
		<form v-if="!submitted" class="space-y-4" @submit.prevent="submitForm">
			<div>
				<label class="mb-1.5 block text-sm font-medium text-foreground"
					>Email address</label
				>
				<Input
					v-model="email"
					class="h-11 border-border/50 bg-secondary/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
					placeholder="you@example.com"
					type="email"
				/>
			</div>

			<Button
				:disabled="isSubmitting"
				class="mt-6 w-full shadow-[0_0_20px_rgb(var(--primary-rgb)_/_0.2)]"
				size="lg"
				type="submit"
			>
				{{ isSubmitting ? "Sending..." : "Send reset instructions" }}
			</Button>
		</form>

		<div
			v-else
			class="rounded-2xl border border-primary/20 bg-primary/10 px-5 py-5 text-sm leading-7 text-muted-foreground"
		>
			If an account exists for <span class="font-semibold text-foreground">{{ email }}</span
			>, password reset instructions have been sent.
		</div>

		<template #footer>
			<div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
				<span>Remembered your password?</span>
				<NuxtLink class="font-bold text-primary hover:underline" to="/login">
					Back to login
				</NuxtLink>
			</div>
		</template>
	</AuthCardLayout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import AuthCardLayout from "~/components/auth/AuthCardLayout.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

definePageMeta({
	layout: false,
});

useSeoMeta({
	description: "Request password reset instructions for your Laxiriir Expert account.",
	title: "Forgot Password | Laxiriir Expert",
});

const email = ref("");
const isSubmitting = ref(false);
const submitted = ref(false);

async function submitForm() {
	isSubmitting.value = true;
	await new Promise((resolve) => setTimeout(resolve, 900));
	isSubmitting.value = false;
	submitted.value = true;
}
</script>
