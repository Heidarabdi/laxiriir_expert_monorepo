<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] opacity-70 pointer-events-none"></div>

    <div class="w-full max-w-md bg-card border border-border/50 rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-3xl">
      <div class="text-center mb-8 flex flex-col items-center">
        <NuxtLink to="/" class="flex items-center gap-3 font-display text-2xl font-bold tracking-tighter text-foreground group cursor-pointer mb-6">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary transform group-hover:-translate-y-1 transition-all duration-300 drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]">
                <path d="M16 2L2 9L16 16L30 9L16 2Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 23L16 30L30 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 16L16 23L30 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 16V30" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Laxiriir<span class="text-muted-foreground font-normal">.expert</span></span>
        </NuxtLink>
        <h1 class="text-2xl font-bold font-display mb-2">Create an Account</h1>
        <p class="text-sm text-muted-foreground">Get started as a client or expert today</p>
      </div>

      <form class="space-y-4" @submit.prevent>
        <div>
          <label class="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
          <Input type="text" placeholder="John Doe" class="bg-secondary/30 border-white/10 text-foreground h-11 focus-visible:border-primary focus-visible:ring-primary/20" />
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
          <Input type="email" placeholder="you@example.com" class="bg-secondary/30 border-white/10 text-foreground h-11 focus-visible:border-primary focus-visible:ring-primary/20" />
        </div>
        <div>
          <label class="block text-sm font-medium text-foreground mb-1.5">Password</label>
          <Input type="password" placeholder="••••••••" class="bg-secondary/30 border-white/10 text-foreground h-11 focus-visible:border-primary focus-visible:ring-primary/20" />
        </div>
        
        <Button class="w-full mt-6 shadow-[0_0_20px_rgba(var(--color-primary),0.2)]" size="lg">
          Sign Up
        </Button>
      </form>

      <div class="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground pt-6 border-t border-border/50">
        <span>Already have an account?</span>
        <NuxtLink to="/login" class="text-primary font-bold hover:underline transition-all">Sign in</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

definePageMeta({
  layout: false
})

useHead({
  title: 'Sign Up | Laxiriir Expert'
})
</script>
