<script setup lang="ts">
useHead({
	link: [
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&family=Inter:wght@400;500;600&display=swap",
		},
		{
			rel: "stylesheet",
			href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap",
		},
	],
});
</script>

<template>
	<NuxtLoadingIndicator color="#4f46e5" />
	<NuxtRouteAnnouncer />
	<div class="min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
		<NuxtPage />
	</div>
</template>
