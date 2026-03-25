<template>
	<AuthCardLayout
		description="Enter your reset token and choose a new password to regain access to your account."
		eyebrow="Password reset"
		title="Set a new password"
	>
		<form v-if="!saved" class="space-y-4" @submit.prevent="submitForm">
			<div>
				<label class="mb-1.5 block text-sm font-medium text-foreground"
					>Reset token</label
				>
				<Input
					v-model="form.code"
					class="h-11 border-border/50 bg-secondary/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
					placeholder="Enter your reset token"
					type="text"
				/>
			</div>

			<div>
				<label class="mb-1.5 block text-sm font-medium text-foreground"
					>New password</label
				>
				<Input
					v-model="form.password"
					class="h-11 border-border/50 bg-secondary/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
					placeholder="••••••••"
					type="password"
				/>
			</div>

			<div>
				<label class="mb-1.5 block text-sm font-medium text-foreground"
					>Confirm password</label
				>
				<Input
					v-model="form.confirmPassword"
					class="h-11 border-border/50 bg-secondary/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
					placeholder="••••••••"
					type="password"
				/>
			</div>

			<Button
				:disabled="isSubmitting"
				class="mt-6 w-full shadow-[0_0_20px_rgb(var(--primary-rgb)_/_0.2)]"
				size="lg"
				type="submit"
			>
				{{ isSubmitting ? "Saving..." : "Save new password" }}
			</Button>

			<p
				v-if="errorMessage"
				class="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
			>
				{{ errorMessage }}
			</p>
		</form>

		<div
			v-else
			class="rounded-2xl border border-primary/20 bg-primary/10 px-5 py-5 text-sm leading-7 text-muted-foreground"
		>
			Your password has been updated. You can now return to login and access your account with the new password.
		</div>

		<template #footer>
			<div class="flex items-center justify-center gap-2 text-sm text-muted-foreground">
				<span>Need a new reset link?</span>
				<NuxtLink
					class="font-bold text-primary hover:underline"
					to="/forgot-password"
				>
					Request another
				</NuxtLink>
			</div>
		</template>
	</AuthCardLayout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import AuthCardLayout from "~/components/auth/AuthCardLayout.vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

definePageMeta({
	layout: false,
	middleware: "guest-only",
});

useSeoMeta({
	description: "Reset your Laxiriir Expert account password.",
	title: "Reset Password | Laxiriir Expert",
});

const route = useRoute();

const form = ref({
	code:
		typeof route.query.token === "string"
			? route.query.token
			: typeof route.query.code === "string"
				? route.query.code
				: "",
	confirmPassword: "",
	password: "",
});

const isSubmitting = ref(false);
const saved = ref(false);
const errorMessage = ref("");
const passwordsMatch = computed(
	() => form.value.password !== "" && form.value.password === form.value.confirmPassword,
);

async function submitForm() {
	if (!passwordsMatch.value) {
		errorMessage.value = "Passwords do not match.";
		return;
	}

	isSubmitting.value = true;
	errorMessage.value = "";
	try {
		await useAuthStore().resetPassword(form.value.code, form.value.password);
		saved.value = true;
	} catch (error) {
		errorMessage.value =
			error instanceof Error ? error.message : "Unable to reset your password.";
	} finally {
		isSubmitting.value = false;
	}
}
</script>
