<template>
  <button
    @click="toggleDark()"
    class="p-2 rounded-full bg-secondary/80 text-foreground hover:bg-secondary transition-colors flex items-center justify-center"
    aria-label="Toggle Dark Mode"
  >
    <Sun v-if="!isDark" class="w-5 h-5 text-foreground" />
    <Moon v-else class="w-5 h-5 text-foreground" />
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
