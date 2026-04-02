<template>
    <div
        class="flex min-h-screen items-center justify-center bg-background px-6 text-foreground"
    >
        <h1 class="text-3xl font-semibold tracking-tight">
            Welcome to pending
        </h1>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: false,
    middleware: ["auth-required", "verified-required", "role-required"],
    roles: ["expert"],
});

useSeoMeta({
    title: "Expert Review | Laxiriir Expert",
});
</script>
