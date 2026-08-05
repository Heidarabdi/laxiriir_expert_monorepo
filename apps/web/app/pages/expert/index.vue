<script setup lang="ts">
definePageMeta({
	layout: false,
	middleware: [
		"auth-required",
		"verified-required",
		"role-required",
		"expert-approved-required",
	],
	roles: ["expert"],
});

useSeoMeta({
	title: "Expert | Laxiriir Expert",
});
</script>

<template>
	<div class="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
		<div class="max-w-lg text-center">
			<p class="text-sm font-bold uppercase tracking-widest text-primary">Expert workspace</p>
			<h1 class="mt-3 font-display text-4xl font-bold tracking-tight">Manage when clients can book you</h1>
			<p class="mt-3 text-muted-foreground">Publish open times, adjust your schedule, and keep booked slots protected.</p>
			<NuxtLink
				to="/expert/calendar"
				class="mt-7 inline-flex rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground"
			>
				Open availability calendar
			</NuxtLink>
		</div>
	</div>
</template>
