<template>
  <div class="bg-background text-foreground font-sans min-h-screen flex flex-col">
    <NavBar />

    <main class="grow pt-32 pb-16 md:pb-24 px-6 md:px-8 max-w-4xl mx-auto w-full">
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight">Terms of Service</h1>
        <p class="text-muted-foreground">Last updated: {{ new Date().toLocaleDateString() }}</p>
      </div>
      
      <div class="prose prose-invert max-w-none text-muted-foreground">
        <p>Please read these Terms of Service carefully before using the Laxiriir.expert platform.</p>
        
        <h3 class="text-foreground font-display mt-8">1. Acceptance of Terms</h3>
        <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>
        
        <h3 class="text-foreground font-display mt-8">2. Description of Service</h3>
        <p>Laxiriir provides an online marketplace that connects individuals seeking expertise ("Clients") with independent professionals ("Experts"). Our platform facilitates scheduling, communication, and payment for consultation services.</p>
        
        <h3 class="text-foreground font-display mt-8">3. User Accounts</h3>
        <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.</p>
        
        <h3 class="text-foreground font-display mt-8">4. Expert Verification</h3>
        <p>While we attempt to verify the credentials of Experts on our platform, we make no guarantees regarding their specific qualifications, the outcome of any consultation, or the absolute accuracy of their advice. Clients assume full responsibility for decisions made based on consultations.</p>
        
        <h3 class="text-foreground font-display mt-8">5. Payments and Refunds</h3>
        <p>All payments are processed securely through our third-party payment providers. Refunds are subject to our refund policy, which is available on our dedicated Support page. Generally, consultations cancelled with less than 24 hours notice are non-refundable.</p>
        
        <h3 class="text-foreground font-display mt-8">6. Changes to Terms</h3>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes via email or platform notification.</p>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import NavBar from '~/components/landing/NavBar.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'

useHead({
  title: 'Terms of Service | Laxiriir.expert'
})
</script>
