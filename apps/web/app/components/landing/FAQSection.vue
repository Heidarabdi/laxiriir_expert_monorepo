<script setup lang="ts">
import { ref } from 'vue'

// FAQSection component
const faqs = ref([
	{
		question: 'How do I know the experts are legitimate?',
		answer: 'Every professional on our platform undergoes a rigorous 4-step verification process including credential verification, identity checks, and peer reviews.',
		isOpen: false
	},
	{
		question: 'Is my consultation completely private?',
		answer: 'Yes. We use military-grade end-to-end encryption. Sessions are not recorded unless explicitly requested by both parties, and no data is sold to third parties.',
		isOpen: false
	},
	{
		question: 'How does the escrow payment system work?',
		answer: 'Your payment is held securely in escrow before the session begins. Funds are only released to the expert once the session is successfully completed.',
		isOpen: false
	},
	{
		question: 'Can I reschedule a session?',
		answer: 'Yes, you can reschedule up to 24 hours before your session without any penalty. Late reschedules may be subject to a fee depending on the expert\'s policy.',
		isOpen: false
	}
])
</script>

<template>
	<section class="py-16 md:py-24 px-6 md:px-8 bg-background border-t border-border/10">
		<div class="max-w-3xl mx-auto">
			<h2 class="font-display text-3xl sm:text-4xl font-bold mb-8 md:mb-12 text-center text-foreground">Frequently Asked Questions</h2>
			<div class="space-y-4">
				<div
					v-for="(faq, index) in faqs"
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
		</div>
	</section>
</template>
