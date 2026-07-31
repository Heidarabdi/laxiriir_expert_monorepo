<script setup lang="ts">
const { isCollapsed } = useClientSidebar();
const route = useRoute();

const searchPlaceholder = computed(
	() =>
		(route.meta.clientSearchPlaceholder as string | undefined) ?? "Search...",
);
</script>

<template>
	<div class="flex min-h-screen bg-background text-foreground">
		<ClientSidebar />

		<main
			class="min-w-0 flex-1 transition-all duration-300"
			:class="isCollapsed ? 'md:ml-16' : 'md:ml-64'"
		>
			<ClientHeader :placeholder="searchPlaceholder" />
			<slot />
		</main>
	</div>
</template>
