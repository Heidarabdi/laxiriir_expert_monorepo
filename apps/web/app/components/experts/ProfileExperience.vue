<template>
  <section>
    <h2 class="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-12">Pedigree &amp; Practice</h2>
    <div class="space-y-12">
      <div v-for="(item, index) in experience" :key="index" class="flex gap-8 group">
        <div class="w-px bg-border/30 relative">
          <div :class="[
            'absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full ring-4',
            index === 0 ? 'bg-primary ring-primary/20' : 'bg-muted ring-border/20'
          ]"></div>
        </div>
        <div class="pb-4">
          <span class="text-sm font-bold text-primary mb-2 block">{{ item.year }}</span>
          <h3 class="text-xl font-bold font-display mb-1">{{ item.title }}</h3>
          <p class="text-muted-foreground text-sm">{{ item.company }}</p>
          <p class="mt-4 text-muted-foreground leading-relaxed">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  experience: {
    year: string
    title: string
    company: string
    description: string
  }[]
}>()
</script>
