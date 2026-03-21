<template>
  <aside class="lg:col-span-4 space-y-8">
    <!-- Quick Info Card -->
    <div class="bg-card/60 backdrop-blur-xl p-8 rounded-2xl border border-border/50 sticky top-32">
      <h3 class="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-8">Quick Intelligence</h3>
      <div class="space-y-10">
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary mt-1">payments</span>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Session Price</p>
            <p class="text-2xl font-bold font-headline">${{ expert.price }} <span class="text-sm font-normal text-muted-foreground">/ 50 min</span></p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary mt-1">language</span>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Languages</p>
            <p class="text-lg font-medium">{{ expert.languages.join(', ') }}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary mt-1">bolt</span>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Response Time</p>
            <p class="text-lg font-medium">{{ expert.responseTime }}</p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="material-symbols-outlined text-primary mt-1">verified_user</span>
          <div>
            <p class="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">Verification</p>
            <p class="text-lg font-medium text-secondary">Identity &amp; Credentials Verified</p>
          </div>
        </div>
      </div>
      
      <div class="mt-12 space-y-4">
        <button class="w-full bg-primary text-primary-foreground font-extrabold py-4 rounded-xl shadow-lg shadow-primary/10 hover:brightness-110 transition-all">Instant Booking</button>
        <button class="w-full bg-transparent border border-border/80 text-foreground font-bold py-4 rounded-xl hover:bg-white/5 transition-all">Schedule Discovery Call</button>
      </div>
      <div class="mt-8 p-4 bg-cardest/40 rounded-lg text-center">
        <p class="text-[10px] text-muted-foreground uppercase tracking-widest">Next available slot</p>
        <p class="text-sm font-bold text-primary">{{ expert.nextSlot }}</p>
      </div>
    </div>
    
    <!-- Trusted Badge -->
    <div class="p-6 rounded-2xl bg-surface-container-high border border-border/30 text-center">
      <span class="material-symbols-outlined text-4xl text-tertiary mb-3">shield_person</span>
      <p class="text-xs text-muted-foreground px-4">All sessions are end-to-end encrypted and HIPAA compliant.</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  expert: {
    price: number
    languages: string[]
    responseTime: string
    nextSlot: string
  }
}>()
</script>
