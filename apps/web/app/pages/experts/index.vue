<template>
  <div class="bg-background selection:bg-primary/30 min-h-screen flex flex-col">
    <NavBar />

    <main class="grow pt-28 pb-12">
      <div class="max-w-7xl mx-auto px-6 md:px-8">
        <header class="mb-12">
          <h1 class="text-4xl sm:text-5xl md:text-6xl font-black font-display tracking-tighter mb-4 text-foreground">
            Discover Expertise.
          </h1>
          <p class="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            Connect with high-performance consultants across medical, tech, and strategy domains.
            Frictionless execution starts with the right perspective.
          </p>
          <p class="mt-4 text-sm uppercase tracking-[0.28em] text-muted-foreground">
            {{ filteredExperts.length }} matching expert{{ filteredExperts.length === 1 ? "" : "s" }}
          </p>
        </header>

        <ExpertSearchArea
          :categories="expertCategories"
          :search-query="searchQuery"
          :selected-category="selectedCategory"
          @update:search-query="searchQuery = $event"
          @update:selected-category="selectedCategory = $event"
        />

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ExpertFilters
            :max-price="maxPrice"
            :price-range-max="priceRangeMax"
            :selected-availability-windows="selectedAvailabilityWindows"
            @update:max-price="maxPrice = $event"
            @update:selected-availability-windows="selectedAvailabilityWindows = $event"
          />

          <div class="md:col-span-3">
            <div v-if="filteredExperts.length > 0" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <ExpertCard v-for="expert in filteredExperts" :key="expert.id" :expert="expert" />
            </div>

            <div v-else class="rounded-3xl border border-border/40 bg-card p-10 text-center">
              <p class="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">No matches</p>
              <h2 class="mt-4 font-display text-3xl font-bold text-foreground">
                Nothing fits the current filters.
              </h2>
              <p class="mt-3 text-muted-foreground">
                Try widening the price range or relaxing one of the availability filters.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  expertCategories,
  experts,
  getStartingPrice,
  matchesAvailabilityWindow,
} from '~/data/experts'
import ExpertCard from '~/components/experts/ExpertCard.vue'
import ExpertFilters from '~/components/experts/ExpertFilters.vue'
import ExpertSearchArea from '~/components/experts/ExpertSearchArea.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'
import NavBar from '~/components/landing/NavBar.vue'
import type { AvailabilityWindow, ExpertCategory } from '~/types/experts'

definePageMeta({
  layout: false,
})

useHead({
  title: 'Laxiriir Expert | Expert Directory',
  meta: [
    {
      name: 'description',
      content: 'Discover leading experts across strategy, tech, medical, and design domains.',
    },
  ],
})

const searchQuery = ref('')
const selectedCategory = ref<"All" | ExpertCategory>('All')
const selectedAvailabilityWindows = ref<AvailabilityWindow[]>(['today'])
const priceRangeMax = Math.max(...experts.map((expert) => getStartingPrice(expert)))
const maxPrice = ref(priceRangeMax)

const filteredExperts = computed(() =>
  experts.filter((expert) => {
    const query = searchQuery.value.trim().toLowerCase()
    const matchesSearch =
      query.length === 0 ||
      expert.name.toLowerCase().includes(query) ||
      expert.title.toLowerCase().includes(query) ||
      expert.category.toLowerCase().includes(query) ||
      expert.tags.some((tag) => tag.toLowerCase().includes(query))

    const matchesCategory =
      selectedCategory.value === 'All' || expert.category === selectedCategory.value

    const matchesPrice = getStartingPrice(expert) <= maxPrice.value

    const matchesAvailability = selectedAvailabilityWindows.value.every((window) =>
      matchesAvailabilityWindow(expert, window),
    )

    return matchesSearch && matchesCategory && matchesPrice && matchesAvailability
  }),
)
</script>
