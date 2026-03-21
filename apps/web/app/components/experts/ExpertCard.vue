<template>
  <div class="group relative bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 transition-all duration-500">
    <div class="h-64 overflow-hidden relative">
      <img :alt="expert.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" :src="expert.image"/>
      <div class="absolute inset-0 bg-linear-to-t from-background to-transparent opacity-80"></div>
      <div class="absolute bottom-4 left-4">
        <span :class="['px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full', badgeClass]">
          {{ expert.category }}
        </span>
      </div>
    </div>
    
    <div class="p-6">
      <div class="flex justify-between items-start mb-2">
        <div>
          <h3 class="text-xl font-bold font-headline group-hover:text-primary transition-colors">{{ expert.name }}</h3>
          <p class="text-sm text-muted-foreground">{{ expert.title }}</p>
        </div>
        <div class="flex items-center gap-1 text-primary">
          <span class="material-symbols-outlined text-sm" data-icon="star" style="font-variation-settings: 'FILL' 1;">star</span>
          <span class="text-sm font-bold">{{ expert.rating }}</span>
        </div>
      </div>
      
      <div class="flex items-center gap-2 mb-6">
        <span class="text-lg font-black text-foreground">${{ expert.price }}</span>
        <span class="text-xs text-muted-foreground uppercase tracking-tighter">per hour</span>
      </div>
      
      <div class="grid grid-cols-2 gap-3">
        <NuxtLink :to="`/experts/${expert.id}`" class="py-3 bg-muted text-foreground text-center flex items-center justify-center text-xs font-bold rounded-xl hover:bg-accent transition-colors">
          View Profile
        </NuxtLink>
        <Button class="w-full py-6 rounded-xl font-bold text-xs shadow-[0_0_20px_rgba(var(--color-primary),0.3)]">
          Book Now
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Button } from '@/components/ui/button';

interface Expert {
  id: string;
  name: string;
  title: string;
  category: string;
  rating: number;
  price: number;
  image: string;
}

const props = defineProps<{
  expert: Expert
}>();

const badgeClass = computed(() => {
  switch (props.expert.category.toLowerCase()) {
    case 'strategy':
      return 'bg-primary text-primary-foreground';
    case 'tech':
      return 'bg-blue-500/10 text-blue-500';
    case 'medical':
      return 'bg-purple-500/10 text-purple-500';
    case 'design':
      return 'bg-destructive/10 text-destructive';
    default:
      return 'bg-muted text-muted-foreground';
  }
});
</script>
