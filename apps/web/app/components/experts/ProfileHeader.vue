<template>
  <section class="relative mb-16">
    <div class="flex flex-col md:flex-row gap-12 items-end">
      <div class="relative group">
        <div class="absolute -inset-1 bg-linear-to-tr from-primary to-chart-3 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
        <img :alt="expert.name" class="relative w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl grayscale hover:grayscale-0 transition-all duration-500 border border-border/50" :src="expert.image"/>
      </div>
      <div class="flex-1 space-y-4">
        <div class="flex flex-wrap items-center gap-3">
          <span class="bg-purple-500/10 text-purple-500 text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">Top Rated Expert</span>
          <div class="flex items-center text-primary">
            <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
            <span class="ml-1 text-sm font-bold">{{ expert.rating }} ({{ expert.reviewsCount }} Reviews)</span>
          </div>
        </div>
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tighter font-display text-foreground">{{ expert.name }}</h1>
        <p class="text-2xl font-medium text-muted-foreground max-w-2xl">{{ expert.title }}</p>
        <div class="pt-4 flex flex-wrap gap-4">
          <button class="bg-primary hover:brightness-110 text-primary-foreground font-extrabold px-8 py-4 rounded-full text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-all">Book Session</button>
          <button class="bg-muted border border-border/60 text-foreground font-bold px-8 py-4 rounded-full text-lg hover:bg-accent transition-colors">Message</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  expert: {
    name: string
    title: string
    rating: number
    reviewsCount: number
    image: string
  }
}>()
</script>
