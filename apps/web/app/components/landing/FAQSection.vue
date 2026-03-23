<script setup lang="ts">
import { ref } from "vue";
import { faqs } from "~/data/faqs";

const featuredFaqs = ref(
	faqs.slice(0, 4).map((faq) => ({
		...faq,
		isOpen: false,
	})),
);
</script>

<template>
	<section class="py-16 md:py-24 px-6 md:px-8 bg-background border-t border-border/10">
		<div class="max-w-3xl mx-auto">
			<h2 class="font-display text-3xl sm:text-4xl font-bold mb-8 md:mb-12 text-center text-foreground">Frequently Asked Questions</h2>
			<div class="space-y-4">
				<div
					v-for="(faq, index) in featuredFaqs"
					:key="index"
					class="bg-secondary/30 border border-border/10 rounded-2xl overflow-hidden transition-all duration-300"
				>
					<button
						@click="faq.isOpen = !faq.isOpen"
						class="w-full px-8 py-6 flex items-center justify-between text-left hover:bg-secondary/50 transition-colors"
					>
						<span class="font-bold text-lg font-display text-foreground">{{ faq.question }}</span>
						<span class="material-symbols-outlined text-muted-foreground transition-transform duration-300" :class="{ 'rotate-180': faq.isOpen }">
							expand_more
						</span>
					</button>
					<div
						v-show="faq.isOpen"
						class="px-8 pb-6 text-muted-foreground font-sans leading-relaxed"
					>
						<div class="w-12 h-px bg-primary/20 mb-6"></div>
						{{ faq.answer }}
					</div>
				</div>
			</div>
			<div class="mt-8 text-center">
				<NuxtLink
					class="inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-3 text-sm font-bold text-foreground transition hover:bg-muted"
					to="/faq"
				>
					View full FAQ
				</NuxtLink>
			</div>
		</div>
	</section>
</template>
