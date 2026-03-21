<template>
  <section>
    <h2 class="text-xs uppercase tracking-[0.3em] text-primary font-bold mb-8">Architectural Bio</h2>
    <div class="space-y-6 text-lg text-muted-foreground leading-relaxed">
      <p v-for="(paragraph, index) in expert.bio" :key="index">{{ paragraph }}</p>
    </div>
    <div class="mt-12 flex flex-wrap gap-3">
      <span v-for="tag in expert.tags" :key="tag" class="px-5 py-2 bg-surface-container-high rounded-full border border-border/30 text-sm font-medium">
        {{ tag }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  expert: {
    bio: string[]
    tags: string[]
  }
}>()
</script>
