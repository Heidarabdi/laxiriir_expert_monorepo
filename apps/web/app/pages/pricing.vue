<template>
  <div class="bg-background text-foreground font-sans min-h-screen flex flex-col">
    <NavBar />

    <main class="grow pt-28 pb-0">
      <PricingSection />
      
      <!-- FAQ or Additional info block could go here -->
      <section class="max-w-4xl mx-auto px-8 pb-32">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
          <p class="text-muted-foreground">Everything you need to know about billing and subscriptions.</p>
        </div>
        
        <div class="bg-card border border-border/30 rounded-2xl divide-y divide-border/30">
          <div class="p-6">
            <h3 class="font-bold mb-2">How does escrow work?</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Funds are securely held until the consultation is fully delivered and approved by the client, protecting both parties.</p>
          </div>
          <div class="p-6">
            <h3 class="font-bold mb-2">When do experts get paid?</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Experts receive payouts directly to their linked bank accounts within 48 hours of a completed session.</p>
          </div>
          <div class="p-6">
            <h3 class="font-bold mb-2">Can I cancel a session?</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">Yes, sessions can be rescheduled or cancelled up to 24 hours in advance at no cost.</p>
          </div>
        </div>
      </section>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/landing/NavBar.vue'
import PricingSection from '~/components/landing/PricingSection.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'

definePageMeta({
  layout: false
})

useHead({
  title: 'Pricing | Laxiriir Expert',
  meta: [
    {
      name: 'description',
      content: 'Simple, transparent pricing for both clients and experts.',
    },
  ],
})
</script>
