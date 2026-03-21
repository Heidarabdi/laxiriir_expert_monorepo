<template>
  <section class="mb-12 bg-card p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 border border-border/30">
    <div class="flex-1 w-full flex items-center px-4 bg-surface-container rounded-xl">
      <span class="material-symbols-outlined text-muted-foreground" data-icon="search">search</span>
      <input
        class="bg-transparent border-none focus:ring-0 text-foreground w-full py-4 px-3 placeholder:text-muted-foreground-variant text-sm"
        placeholder="Search for experts, skills, or industries..."
        type="text"
      />
    </div>
    <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 px-2 scrollbar-none">
      <button v-for="tag in tags" :key="tag.label"
        :class="[
          'whitespace-nowrap px-6 py-2 rounded-full font-medium text-sm transition-all',
          tag.active 
            ? 'bg-primary text-primary-foreground font-bold active:scale-95'
            : 'bg-muted text-muted-foreground hover:text-foreground'
        ]">
        {{ tag.label }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tags = ref([
  { label: 'All', active: true },
  { label: 'Medical', active: false },
  { label: 'Strategy', active: false },
  { label: 'Tech', active: false },
  { label: 'Design', active: false },
]);
</script>
