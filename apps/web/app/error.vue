<template>
  <div class="bg-background text-foreground font-sans min-h-screen flex flex-col">
    <!-- Inline Minimal Nav just for the error page to avoid complex component auto-import issues on fatal errors -->
    <header class="p-6 md:p-8 flex items-center justify-between border-b border-border/10">
      <NuxtLink to="/" class="font-display font-bold text-2xl tracking-tight text-foreground transition-opacity hover:opacity-80">
        laxiriir<span class="text-primary">.expert</span>
      </NuxtLink>
    </header>

    <main class="grow flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      <!-- Glow effect -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 dark:bg-primary/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen opacity-50"></div>

      <div class="relative mb-8 z-10">
        <h1 class="text-8xl md:text-9xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-foreground to-foreground/50">
          {{ error.statusCode === 404 ? '404' : error.statusCode }}
        </h1>
      </div>
      
      <h2 class="text-2xl md:text-3xl font-display font-bold mb-4 z-10">
        {{ error.statusCode === 404 ? 'Page not found' : 'An error occurred' }}
      </h2>
      
      <p class="text-muted-foreground text-lg max-w-md mx-auto mb-10 z-10">
        {{ error.statusCode === 404 
          ? "The page you're looking for doesn't exist or has been moved." 
          : error.message || "We're having some trouble loading this page right now." }}
      </p>
      
      <Button @click="handleError" class="z-10 h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-all shadow-lg hover:shadow-primary/25">
        Return Home
      </Button>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'

const props = defineProps({
  error: {
    type: Object,
    required: true
  }
})

const handleError = () => clearError({ redirect: '/' })
</script>
