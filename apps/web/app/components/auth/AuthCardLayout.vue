<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
	defineProps<{
		description: string;
		eyebrow?: string;
		size?: "default" | "wide";
		title: string;
	}>(),
	{
		eyebrow: "",
		size: "default",
	},
);

const cardSizeClass = computed(() =>
	props.size === "wide" ? "max-w-xl" : "max-w-md",
);
</script>

<template>
	<div
		class="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12 text-foreground"
	>
		<div
			class="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[120px] opacity-70 md:h-[620px] md:w-[620px]"
		></div>
		<div
			class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(109,254,156,0.12),_transparent_28%)]"
		></div>

		<div
			:class="[
				'w-full rounded-[2rem] border border-border/50 bg-card/92 p-6 shadow-xl shadow-black/10 backdrop-blur-3xl md:p-8',
				cardSizeClass,
			]"
		>
			<div class="mb-8 flex flex-col items-center text-center">
				<NuxtLink
					to="/"
					class="group mb-6 flex items-center gap-3 font-display text-2xl font-bold tracking-tighter text-foreground"
				>
					<svg
						width="32"
						height="32"
						viewBox="0 0 32 32"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						class="text-primary transition-all duration-300 group-hover:-translate-y-1 drop-shadow-[0_0_8px_rgb(var(--primary-rgb)_/_0.3)]"
					>
						<path
							d="M16 2L2 9L16 16L30 9L16 2Z"
							fill="currentColor"
							fill-opacity="0.2"
							stroke="currentColor"
							stroke-width="2"
							stroke-linejoin="round"
						/>
						<path
							d="M2 23L16 30L30 23"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M2 16L16 23L30 16"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path
							d="M16 16V30"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
					<span
						>Laxiriir<span class="font-normal text-muted-foreground">.expert</span></span
					>
				</NuxtLink>

				<p
					v-if="eyebrow"
					class="text-[10px] font-bold uppercase tracking-[0.35em] text-primary"
				>
					{{ eyebrow }}
				</p>
				<h1 class="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
					{{ title }}
				</h1>
				<p class="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
					{{ description }}
				</p>
			</div>

			<slot />

			<div v-if="$slots.footer" class="mt-8 border-t border-border/50 pt-6">
				<slot name="footer" />
			</div>
		</div>
	</div>
</template>
