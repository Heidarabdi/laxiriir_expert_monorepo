<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
</script>
<template>
	<nav
		class="fixed top-0 w-full z-50 bg-transparent backdrop-blur-xl bg-background/60 shadow-2xl shadow-black/40"
	>
		<div class="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
			<!-- Logo -->
			<NuxtLink to="/" class="flex items-center gap-3 font-display text-2xl font-bold tracking-tighter text-white group cursor-pointer">
				<svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary transform group-hover:-translate-y-1 transition-all duration-300 drop-shadow-[0_0_8px_rgba(var(--primary),0.3)]">
					<path d="M16 2L2 9L16 16L30 9L16 2Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
					<path d="M2 23L16 30L30 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2 16L16 23L30 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M16 16V30" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<span>Laxiriir<span class="text-muted-foreground font-normal">.expert</span></span>
			</NuxtLink>
			<div class="hidden md:flex items-center gap-8">
				<NuxtLink
					to="/experts"
					class="text-muted-foreground hover:text-foreground transition-colors font-display tracking-tight"
				>
					Experts Directory
				</NuxtLink>
				<NuxtLink
					to="/#disciplines"
					class="text-muted-foreground hover:text-foreground transition-colors font-display tracking-tight"
				>
					Disciplines
				</NuxtLink>
				<NuxtLink
					to="/pricing"
					class="text-muted-foreground hover:text-foreground transition-colors font-display tracking-tight"
				>
					Pricing
				</NuxtLink>
			</div>
			<div class="flex items-center gap-6">
				<ThemeToggle />
				<NuxtLink to="/login" class="text-muted-foreground hover:text-foreground font-medium transition-all">
					Log In
				</NuxtLink>
				<NuxtLink
					to="/register"
					class="bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform inline-block"
				>
					Get Started
				</NuxtLink>
			</div>
		</div>
	</nav>
</template>
