<template>
	<div class="min-h-screen bg-background text-foreground">
		<div class="mx-auto flex min-h-screen max-w-4xl flex-col px-6 py-16 md:px-8">
			<div class="rounded-4xl border border-border/50 bg-secondary/50 p-8 backdrop-blur-3xl">
				<p class="text-[10px] font-bold uppercase tracking-[0.35em] text-primary">
					Admin dashboard
				</p>
				<h1 class="mt-4 font-display text-4xl font-bold tracking-tight">Platform administration</h1>
				<p class="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
					Authentication and role separation are active. This is the protected admin landing
					surface while the full operations dashboard is still being built.
				</p>
				<div class="mt-8 flex flex-wrap gap-3">
					<NuxtLink
						class="rounded-full border border-border/60 px-5 py-3 text-sm font-semibold transition hover:border-primary/40 hover:bg-secondary"
						to="/"
					>
						Back to homepage
					</NuxtLink>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
definePageMeta({
	layout: false,
	middleware: ["auth-required", "verified-required", "role-required"],
	roles: ["admin"],
});

useSeoMeta({
	title: "Admin | Laxiriir Expert",
});
</script>
