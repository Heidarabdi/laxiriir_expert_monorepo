<template>
  <section>
    <div class="flex justify-between items-end mb-8">
      <h2 class="text-xs uppercase tracking-[0.3em] text-primary font-bold">Session Availability</h2>
      <span class="text-muted-foreground text-sm">{{ currentMonth }}</span>
    </div>
    
    <div class="bg-card p-8 rounded-xl border border-border/50">
      <div class="grid grid-cols-7 gap-4 text-center mb-6">
        <div v-for="day in ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']" :key="day" class="text-[10px] uppercase font-bold text-muted-foreground">
          {{ day }}
        </div>
        
        <!-- Simplified Calendar Grid - Static for Visual Matching -->
        <div class="aspect-square flex items-center justify-center rounded-lg text-muted-foreground opacity-20">28</div>
        <div class="aspect-square flex items-center justify-center rounded-lg text-muted-foreground opacity-20">29</div>
        <div class="aspect-square flex items-center justify-center rounded-lg text-muted-foreground opacity-20">30</div>
        
        <div class="aspect-square flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted cursor-pointer transition-colors">1</div>
        <div class="aspect-square flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted cursor-pointer transition-colors">2</div>
        <div class="aspect-square flex items-center justify-center rounded-lg text-muted-foreground opacity-20">3</div>
        <div class="aspect-square flex items-center justify-center rounded-lg text-muted-foreground opacity-20">4</div>
        
        <div class="aspect-square flex flex-col items-center justify-center rounded-lg bg-primary/10 border border-primary/30 relative">
          <span class="font-bold">5</span>
          <span class="w-1 h-1 bg-primary rounded-full mt-1"></span>
        </div>
        <div class="aspect-square flex flex-col items-center justify-center rounded-lg bg-primary/10 border border-primary/30 relative">
          <span class="font-bold">6</span>
          <span class="w-1 h-1 bg-primary rounded-full mt-1"></span>
        </div>
        
        <div class="aspect-square flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted cursor-pointer transition-colors">7</div>
        <div class="aspect-square flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted cursor-pointer transition-colors">8</div>
        <div class="aspect-square flex items-center justify-center rounded-lg border border-border/60 hover:bg-muted cursor-pointer transition-colors">9</div>
        
        <div class="aspect-square flex items-center justify-center rounded-lg text-muted-foreground opacity-20">10</div>
        <div class="aspect-square flex items-center justify-center rounded-lg text-muted-foreground opacity-20">11</div>
      </div>
      
      <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
        <button class="shrink-0 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:brightness-110 active:scale-95 transition-all">09:00 AM</button>
        <button class="shrink-0 px-6 py-3 bg-secondary border border-border/60 rounded-full font-bold text-sm hover:border-primary transition-colors">11:30 AM</button>
        <button class="shrink-0 px-6 py-3 bg-secondary border border-border/60 rounded-full font-bold text-sm hover:border-primary transition-colors">02:00 PM</button>
        <button class="shrink-0 px-6 py-3 bg-secondary border border-border/60 rounded-full font-bold text-sm hover:border-primary transition-colors">04:30 PM</button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const currentMonth = ref('October 2024')
</script>
