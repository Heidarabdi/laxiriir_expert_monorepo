<template>
	<div class="min-h-screen bg-background text-foreground">
		<div class="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16 md:px-8">
			<div class="rounded-4xl border border-border/50 bg-secondary/50 p-8 backdrop-blur-3xl">
				<p class="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
					Expert review
				</p>
				<h1 class="mt-4 font-display text-4xl font-bold tracking-tight">Application under review</h1>
				<p class="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
					Your expert account is authenticated, but approval is still pending. Admin review will
					unlock the full expert dashboard once credentials are accepted.
				</p>
			</div>
		</div>
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
