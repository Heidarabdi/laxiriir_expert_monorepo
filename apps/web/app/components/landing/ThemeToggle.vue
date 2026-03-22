<template>
  <button
    @click="toggleDark()"
    class="relative w-9 h-9 rounded-full bg-secondary/80 text-foreground hover:bg-secondary cursor-pointer transition-colors flex items-center justify-center overflow-hidden"
    aria-label="Toggle Dark Mode"
  >
    <ClientOnly>
      <Sun 
        class="absolute w-5 h-5 text-foreground transition-all duration-500 ease-in-out"
        :class="isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'"
      />
      <Moon 
        class="absolute w-5 h-5 text-foreground transition-all duration-500 ease-in-out"
        :class="isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'"
      />
      <template #fallback>
        <div class="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      </template>
    </ClientOnly>
  </button>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { Sun, Moon } from 'lucide-vue-next'

const isDark = useDark({
  selector: 'html',
  attribute: 'class',
  valueDark: 'dark', // We will map 'dark' class instead of default, or we can use default for dark
  valueLight: 'light',
})

const toggleDark = useToggle(isDark)
</script>
