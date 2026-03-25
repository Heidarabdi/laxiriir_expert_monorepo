<template>
	<div class="flex min-h-screen flex-col bg-background font-sans text-foreground">
		<NavBar />

		<main class="grow px-6 pb-20 pt-32 md:px-8 md:pb-24">
			<section class="mx-auto max-w-3xl text-center relative">
				<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] opacity-60 pointer-events-none mix-blend-screen -z-10"></div>
				<h1 class="mt-8 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl relative z-10">
					Frequently asked questions
				</h1>
				<p class="mt-4 text-sm leading-7 text-muted-foreground md:text-base relative z-10">
					Clear answers about trust, booking, privacy, payments, and how consultations work across clients and experts.
				</p>
			</section>

			<section class="mx-auto mt-10 max-w-3xl">
				<div class="flex flex-wrap justify-center gap-3">
					<button
						v-for="category in categories"
						:key="category"
						:class="[
							'rounded-full px-5 py-2.5 text-sm font-bold transition-all',
							selectedCategory === category
								? 'bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--color-primary),0.2)]'
								: 'border border-border/50 bg-secondary/50 text-foreground hover:bg-secondary/80 backdrop-blur-sm',
						]"
						type="button"
						@click="selectedCategory = category"
					>
						{{ category }}
					</button>
				</div>
			</section>

			<section class="mx-auto mt-8 max-w-3xl">
				<div class="space-y-3">
					<div
						v-for="faq in filteredFaqs"
						:key="faq.question"
						class="overflow-hidden rounded-2xl border border-border/30 bg-card/60 shadow-xl shadow-black/5 backdrop-blur-sm transition-all duration-300 hover:border-border/50"
					>
						<button
							class="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-secondary/40 md:px-6"
							type="button"
							@click="toggleQuestion(faq.question)"
						>
							<div class="pr-4">
								<p
									class="text-[10px] font-bold uppercase tracking-[0.28em] text-primary/90"
								>
									{{ faq.category }}
								</p>
								<h2 class="mt-2 font-display text-lg font-bold text-foreground md:text-xl">
									{{ faq.question }}
								</h2>
							</div>
							<span
								:class="[
									'material-symbols-outlined text-muted-foreground transition-transform duration-300',
									openQuestion === faq.question ? 'rotate-180' : '',
								]"
							>
								expand_more
							</span>
						</button>
						<div
							v-show="openQuestion === faq.question"
							class="px-5 pb-5 text-muted-foreground md:px-6"
						>
							<div class="mb-4 h-px w-10 bg-primary/20"></div>
							<p class="text-sm leading-6">
								{{ faq.answer }}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section
				class="mx-auto mt-12 max-w-3xl rounded-4xl border border-primary/20 bg-primary/5 px-6 py-10 md:px-10 text-center relative overflow-hidden backdrop-blur-sm shadow-xl shadow-black/5"
			>
				<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(var(--color-primary),0.12),transparent_40%)] pointer-events-none"></div>
				<h2 class="font-display text-2xl font-bold relative z-10">Still need help?</h2>
				<p class="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
					If your question is about account access, billing, or becoming an expert, the support team can route it to the right owner.
				</p>
				<div class="mt-8 flex flex-wrap justify-center gap-4 relative z-10">
					<NuxtLink
						class="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm font-bold text-primary-foreground transition hover:brightness-110 shadow-[0_0_20px_rgba(var(--color-primary),0.2)]"
						to="/contact"
					>
						Contact support
					</NuxtLink>
					<NuxtLink
						class="inline-flex items-center justify-center rounded-full border border-border/50 bg-secondary/50 px-8 py-3 text-sm font-bold text-foreground transition hover:bg-secondary/80 backdrop-blur-sm"
						to="/pricing"
					>
						View pricing
					</NuxtLink>
				</div>
			</section>
		</main>

		<FooterComponent />
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import FooterComponent from "~/components/landing/FooterComponent.vue";
import NavBar from "~/components/landing/NavBar.vue";
import { faqs } from "~/data/faqs";

definePageMeta({
	layout: false,
});

useSeoMeta({
	description:
		"Frequently asked questions about trust, booking, privacy, and payments on Laxiriir Expert.",
	title: "FAQ | Laxiriir Expert",
});

const categories = ["All", "Trust", "Booking", "Payments", "Privacy"] as const;
const selectedCategory = ref<(typeof categories)[number]>("All");
const openQuestion = ref<string | null>(faqs[0]?.question ?? null);

const filteredFaqs = computed(() =>
	selectedCategory.value === "All"
		? faqs
		: faqs.filter((faq) => faq.category === selectedCategory.value),
);

function toggleQuestion(question: string) {
	openQuestion.value = openQuestion.value === question ? null : question;
}
</script>
