<script setup lang="ts">
withDefaults(
	defineProps<{
		inverted?: boolean;
		subtitle?: string;
	}>(),
	{
		inverted: false,
		subtitle: "Video-first consultation platform",
	},
);
</script>

<template>
	<NuxtLink to="/" class="inline-flex items-center gap-3">
		<span
			:class="[
				'flex size-11 items-center justify-center rounded-2xl font-display text-lg font-bold shadow-lg',
				inverted ? 'bg-white text-ink-950' : 'bg-ink-950 text-white',
			]"
		>
			L
		</span>
		<span class="leading-tight">
			<span
				:class="[
					'block font-display text-lg font-bold tracking-tight',
					inverted ? 'text-white' : 'text-ink-950',
				]"
			>
				laxiriir<span class="text-brand-500">.expert</span>
			</span>
			<span
				:class="[
					'block text-[0.72rem] font-medium uppercase tracking-[0.2em]',
					inverted ? 'text-white/55' : 'text-ink-700/70',
				]"
			>
				{{ subtitle }}
			</span>
		</span>
	</NuxtLink>
</template>
