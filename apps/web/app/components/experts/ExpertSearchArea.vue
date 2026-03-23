<template>
  <section class="mb-12 bg-card p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 border border-border/30">
    <div class="flex-1 w-full flex items-center px-4 bg-secondary/50 rounded-xl">
      <span class="material-symbols-outlined text-muted-foreground" data-icon="search">search</span>
      <input
        :value="searchQuery"
        class="bg-transparent border-none focus:ring-0 text-foreground w-full py-4 px-3 placeholder:text-muted-foreground text-sm"
        placeholder="Search for experts, skills, or industries..."
        type="text"
        @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div class="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 px-2 scrollbar-none">
      <button
        v-for="category in categories"
        :key="category"
        :class="[
          'whitespace-nowrap px-6 py-2 rounded-full font-medium text-sm transition-all',
          selectedCategory === category
            ? 'bg-primary text-primary-foreground font-bold active:scale-95'
            : 'bg-muted text-muted-foreground hover:text-foreground'
        ]"
        type="button"
        @click="emit('update:selectedCategory', category)"
      >
        {{ category }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ExpertCategory } from "~/types/experts";

defineProps<{
  categories: Array<"All" | ExpertCategory>;
  searchQuery: string;
  selectedCategory: "All" | ExpertCategory;
}>()

const emit = defineEmits<{
  (e: "update:searchQuery", value: string): void
  (e: "update:selectedCategory", value: "All" | ExpertCategory): void
}>()
</script>
