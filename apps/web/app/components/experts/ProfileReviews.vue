<template>
  <section>
    <div class="flex justify-between items-center mb-12">
      <h2 class="text-xs uppercase tracking-[0.3em] text-primary font-bold">Client Verbatim</h2>
      <button class="text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors">
        View All <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">arrow_forward</span>
      </button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div v-for="review in reviews" :key="review.id" class="bg-card p-8 rounded-xl border border-border/30 space-y-4">
        <div class="flex gap-1 text-primary">
          <span v-for="i in 5" :key="i" class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
        </div>
        <p class="italic text-foreground leading-relaxed">"{{ review.text }}"</p>
        <div class="pt-4 border-t border-border/30">
          <p class="text-sm font-bold">{{ review.author }}</p>
          <p class="text-[10px] uppercase tracking-wider text-muted-foreground">{{ review.authorTitle }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  reviews: {
    id: string
    text: string
    author: string
    authorTitle: string
  }[]
}>()
</script>
