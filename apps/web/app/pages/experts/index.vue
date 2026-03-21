<template>
  <div class="bg-background selection:bg-primary/30 min-h-screen flex flex-col">
    <NavBar />

    <main class="grow pt-28 pb-12">
      <div class="max-w-7xl mx-auto px-8">
        
        <!-- Header Section -->
        <header class="mb-12">
           <h1 class="text-5xl md:text-6xl font-black font-headline tracking-tighter mb-4 text-foreground">Discover Expertise.</h1>
           <p class="text-muted-foreground max-w-2xl text-lg leading-relaxed">
             Connect with high-performance consultants across medical, tech, and strategy domains. Frictionless execution starts with the right perspective.
           </p>
        </header>

        <ExpertSearchArea />

        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <ExpertFilters />

          <div class="md:col-span-3">
             <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <ExpertCard v-for="expert in experts" :key="expert.id" :expert="expert" />
             </div>

             <!-- Pagination Placeholder -->
             <div class="mt-16 flex justify-center gap-2">
                <button class="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary bg-card hover:bg-primary/10 transition-colors">1</button>
                <button class="w-10 h-10 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">2</button>
                <button class="w-10 h-10 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">3</button>
                <span class="flex items-center justify-center px-2 text-muted-foreground">...</span>
                <button class="w-10 h-10 rounded-full border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                   <span class="material-symbols-outlined" data-icon="chevron_right" style="font-variation-settings: 'FILL' 1;">chevron_right</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    </main>

    <FooterComponent />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NavBar from '~/components/landing/NavBar.vue'
import FooterComponent from '~/components/landing/FooterComponent.vue'
import ExpertSearchArea from '~/components/experts/ExpertSearchArea.vue'
import ExpertFilters from '~/components/experts/ExpertFilters.vue'
import ExpertCard from '~/components/experts/ExpertCard.vue'

definePageMeta({
  layout: false
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

const experts = ref([
  {
    id: '1',
    name: 'Dr. Sarah Vance',
    title: 'Exit Strategy Expert',
    category: 'Strategy',
    rating: 4.9,
    price: 250,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEjThFx4oPPLp3XuZvZHpf9Y6xWKGZCB8ycsLiq445mWCc5sN-lI3-lx5j7n2fbBTZ1RfHKkJI7KisE5BWhVy2bSiqnzjbbq9smWrra577eXV9UH2WAxPURq_uVFUTMvUjxrdHXDEdqlbu_E7BkWydTd3kkSga_4Y3VhPJGnxLeHJm148VfdRd0hQHrk7biZWV3JNXFIb4zxO9HZn-gYD5HMYq29cAwu0gn5mgaLK9NkVzaJ7lX9p2G5RJIscaQ8441g-6AVLyfwY'
  },
  {
    id: '2',
    name: 'Marcus Chen',
    title: 'Cloud Infrastructure',
    category: 'Tech',
    rating: 5.0,
    price: 185,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDY6EwRN-OFUZYysJHZ05jtjH1CN-5ODpYwv6bMeVt6Ibq3C2E-yYRoHlRhNMJzNr582eE-V4v0eXlEVWvOeZBb-jaXxuhr-2QFllv9Ax9gJcSxla6SLDtbb7063Fv4xoffM0Ii2Y6fB37RGbCpy38VZSSEAv--SWdyKE0dx9zR6BpfyAjf-5AiBpgokZ5DLgbCJdGTyYAIssGYz_ZK0xYcsVB5rtpRXi__VbS8kIR3asMwCObjbMAUWIgQbuXnqSbbgXN5WCIgUbg'
  },
  {
    id: '3',
    name: 'Dr. Elena Rodriguez',
    title: 'Biotech Advisor',
    category: 'Medical',
    rating: 4.8,
    price: 320,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAubkF6SzsVhLlLmSHwYEH0SFcUuTK7iArQBvf2wY99sMEwMiyybHmoM0sEUa56O4IWwgnU1i3ziCZF5d3T_URagEB8NzweD-3qhGC5pZmlwKQ797SbaPCFXE1nmgVr3dIWEEGjFw3uiWM-ryoe7U6suGvekMZHoyce1x9QAPuTbu0iLq2_PHO1GvE9oVLohZvAg3uu2GZe9pw6pKvrB9KjQiy81rgTCApnZCNCphbfTAur1Fqkt5eCm0vai-QPeQg5H0keYpeuBJc'
  },
  {
    id: '4',
    name: 'Julian Pierce',
    title: 'Growth Architect',
    category: 'Strategy',
    rating: 4.9,
    price: 210,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfI1WgKD9uMZwZi9xJpk1YEZScPfsFy0eycD3PEx7iuql7_C2XM5qEF5inBp-th9rtJ8JWAYuu92UBYtbud8sxI-1YI_wH2xvYZLQFMDCmVXPlgSM_d8hmq6VkSRw_rEHlj_3Wrz5FSFxNrHrZYB1DNfeQbeEXLio-I3y8u0OQMMc7bRzo1lT4m-ltLQhtsSPkwn15QH36EQgg5YxcftaMqVIIyMjWuElffszv2cC5aFVqkPHMZ4ArfrSJYwquSlMUDN_HQy4JGyY'
  },
  {
    id: '5',
    name: 'Anton Berg',
    title: 'Systemic UI Designer',
    category: 'Design',
    rating: 5.0,
    price: 160,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8rWY9Bl09IioLc3O_0E9Cfgo0ufXBUK0Nsb97VOLQEFsYAfJfwXtFJbAM-uyOZ3-V225n7yZd6ImA7QN3jE1cHLI_OBxNX0ZfJd6NS-pFELwodQwEioPgZp2C6nU4_h7-fjo_IcQWHyUIkoqERXIXviez7OkAsDoQAUEDI0lEF_Q1mo6U8RLgZqSZSC29xTGVSeliJcBLJ7GXh6FdztKlTH8V81AEUY0vjtGhQaWIEObUizCdGbq4pARoSF8NgaZAM5968PG9vRA'
  },
  {
    id: '6',
    name: 'Sasha Volkov',
    title: 'ML Ops Engineer',
    category: 'Tech',
    rating: 4.7,
    price: 195,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz2-nvuyJ6bJVKNoIgbOnSvF2ItSMtJjAyCdIaQOVVe_RpK-yTFCjBnGJAtukBXZWGVUmXLiJRr2UsPGSfB_HVMY7j5YLC4Clvz55BCQfOI4psRlzTKpEjX-EdCSNUEAsrVOtTJMEn5DwYap0EkFUH8kCeQ4CiguotO2b1RIAyrsO5fCmI_vQ7iG-yeAZMYmFV_vAhyxEwE-tRa16E5KbK50GwIBjvs82GdNnqCAf56DrZPnPXRpfT_jjmqJo5ZGCuwv5OezdHmjg'
  }
])
</script>
