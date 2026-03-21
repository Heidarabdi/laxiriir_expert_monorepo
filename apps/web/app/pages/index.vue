<script setup lang="ts">
import NavBar from '~/components/landing/NavBar.vue'
import HeroSection from '~/components/landing/HeroSection.vue'
import TrustedBySection from '~/components/landing/TrustedBySection.vue'
import InfrastructureSection from '~/components/landing/InfrastructureSection.vue'
import VideoSection from '~/components/landing/VideoSection.vue'
import DisciplinesSection from '~/components/landing/DisciplinesSection.vue'
import ExpertsSection from '~/components/landing/ExpertsSection.vue'
import IntelligenceSection from '~/components/landing/IntelligenceSection.vue'
import PricingSection from '~/components/landing/PricingSection.vue'
import FAQSection from '~/components/landing/FAQSection.vue'
import CTASection from '~/components/landing/CTASection.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'

definePageMeta({
	layout: false, // Disabling default layout if it wraps it in unwanted styles
})

useHead({
	title: 'Laxiriir Expert | Expertise on Demand',
	meta: [
		{
			name: 'description',
			content: 'Video-first virtual consultation platform for booking and holding secure sessions with professionals.',
		},
	],
})
</script>

<template>
	<div class="landing-page">
		<NavBar />
		<main>
			<HeroSection />
			<TrustedBySection />
			<InfrastructureSection />
			<VideoSection />
			<DisciplinesSection />
			<ExpertsSection />
			<IntelligenceSection />
			<PricingSection />
			<FAQSection />
			<CTASection />
		</main>
		<FooterComponent />
	</div>
</template>
