<template>
    <AuthCardLayout
        description="Sign in to manage bookings, join live sessions, and continue your consultation workflow."
        eyebrow="Secure access"
        title="Welcome back"
    >
        <form class="space-y-4" @submit.prevent="submitForm">
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
                <div class="mb-1.5 flex items-center justify-between gap-4">
                    <label class="block text-sm font-medium text-foreground"
                        >Password</label
                    >
                    <NuxtLink
                        class="text-xs text-primary transition-colors hover:text-primary/80"
                        to="/forgot-password"
                    >
                        Forgot password?
                    </NuxtLink>
                </div>
                <Input
                    v-model="form.password"
                    class="h-11 border-border/50 bg-secondary/50 text-foreground focus-visible:border-primary focus-visible:ring-primary/20"
                    placeholder="••••••••"
                    type="password"
                />
            </div>

            <Button
                :disabled="isSubmitting"
                class="mt-6 w-full shadow-[0_0_20px_rgb(var(--primary-rgb)/0.2)]"
                size="lg"
                type="submit"
            >
                {{ isSubmitting ? "Signing in..." : "Sign in" }}
            </Button>

            <p
                v-if="errorMessage"
                class="rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
                {{ errorMessage }}
            </p>
        </form>

        <template #footer>
            <div
                class="flex items-center justify-center gap-2 text-sm text-muted-foreground"
            >
                <span>Don't have an account?</span>
                <NuxtLink
                    class="font-bold text-primary hover:underline"
                    to="/register"
                >
                    Create one
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
    description: "Secure sign in for clients and experts on Laxiriir Expert.",
    title: "Log In | Laxiriir Expert",
});

const form = ref({
    email: "",
    password: "",
});

const auth = useAuthStore();
const isSubmitting = computed(() => auth.loading);
const errorMessage = computed(() => auth.errorMessage);

async function submitForm() {
    try {
        const user = await auth.signIn({
            email: form.value.email,
            password: form.value.password,
        });
        if (user) {
            await navigateTo(getAuthRedirectPath(user));
        }
    } catch {
        // Error state is stored in Pinia for inline rendering.
    }
}
</script>
