<template>
  <aside class="md:col-span-1 space-y-8">
    <div>
      <h3 class="font-headline font-bold text-lg mb-4 text-foreground">Price Range</h3>
      <div class="space-y-4">
        <input class="w-full accent-primary h-1.5 bg-muted rounded-full appearance-none" type="range" />
        <div class="flex justify-between text-xs font-medium text-muted-foreground uppercase tracking-widest">
          <span>$50/hr</span>
          <span>$1000/hr</span>
        </div>
      </div>
    </div>

    <div>
      <h3 class="font-headline font-bold text-lg mb-4 text-foreground">Availability</h3>
      <div class="space-y-3">
        <label v-for="option in availabilityOptions" :key="option.id" class="flex items-center gap-3 cursor-pointer group">
          <div class="w-5 h-5 rounded border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center">
            <div :class="[
              'w-2.5 h-2.5 bg-primary rounded-sm transition-opacity',
              option.checked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            ]"></div>
          </div>
          <span class="text-sm text-muted-foreground">{{ option.label }}</span>
        </label>
      </div>
    </div>

    <div class="p-6 rounded-2xl bg-linear-to-br from-primary/10 to-transparent border border-primary/20">
      <span class="material-symbols-outlined text-primary mb-4" data-icon="auto_awesome">auto_awesome</span>
      <h4 class="font-bold mb-2">AI-Powered Match</h4>
      <p class="text-xs text-muted-foreground leading-relaxed">Let our expert analyze your project needs and suggest the perfect consultant.</p>
      <button class="mt-4 w-full py-2 bg-primary/20 text-primary border border-primary/30 rounded-lg text-xs font-bold hover:bg-primary/30 transition-colors">Get Started</button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const availabilityOptions = ref([
  { id: 'today', label: 'Available Today', checked: true },
  { id: 'week', label: 'This Week', checked: false }
]);
</script>
