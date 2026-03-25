<template>
	<div class="min-h-screen bg-background text-foreground">
		<div class="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16 md:px-8">
			<div class="rounded-4xl border border-border/50 bg-secondary/50 p-8 backdrop-blur-3xl">
				<p class="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
					Expert dashboard
				</p>
				<h1 class="mt-4 font-display text-4xl font-bold tracking-tight">Expert workspace</h1>
				<p class="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
					Your account is verified and approved for expert access. This protected route is now
					active and ready to become the full expert dashboard in the next build slice.
				</p>
			</div>
		</div>
	</div>
</template>

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
