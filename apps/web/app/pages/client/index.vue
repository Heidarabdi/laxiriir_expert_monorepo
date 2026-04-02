<template>
	<div class="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
		<h1 class="text-3xl font-semibold tracking-tight">Client welcome only</h1>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
	middleware: ["auth-required", "verified-required", "role-required"],
	roles: ["client"],
});

useSeoMeta({
	title: "Client | Laxiriir Expert",
});
</script>
