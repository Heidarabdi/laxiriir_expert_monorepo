<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue'
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)
</script>
<template>
	<nav
		class="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-sm"
	>
		<div class="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-8 h-20">
			<!-- Logo -->
				<NuxtLink to="/" class="flex items-center gap-3 font-display text-2xl font-bold tracking-tighter text-foreground group cursor-pointer">
					<svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary transform group-hover:-translate-y-1 transition-all duration-300 drop-shadow-[0_0_8px_rgb(var(--primary-rgb)_/_0.3)]">
					<path d="M16 2L2 9L16 16L30 9L16 2Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
					<path d="M2 23L16 30L30 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M2 16L16 23L30 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					<path d="M16 16V30" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
				<span>Laxiriir<span class="text-muted-foreground font-normal">.expert</span></span>
			</NuxtLink>

			<!-- Desktop Nav -->
			<div class="hidden md:flex items-center gap-4 lg:gap-8">
				<NuxtLink
					to="/about"
					class="text-muted-foreground hover:text-foreground transition-colors font-display tracking-tight"
				>
					About
				</NuxtLink>
				<NuxtLink
					to="/experts"
					class="text-muted-foreground hover:text-foreground transition-colors font-display tracking-tight whitespace-nowrap"
				>
					Experts Directory
				</NuxtLink>
				<NuxtLink
					to="/pricing"
					class="text-muted-foreground hover:text-foreground transition-colors font-display tracking-tight"
				>
					Pricing
				</NuxtLink>
				<NuxtLink
					to="/contact"
					class="text-muted-foreground hover:text-foreground transition-colors font-display tracking-tight"
				>
					Contact
				</NuxtLink>
			</div>

			<!-- Desktop Actions -->
			<div class="hidden md:flex items-center gap-6">
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

			<!-- Mobile Actions -->
			<div class="flex md:hidden items-center gap-4">
				<ThemeToggle />
				<button @click="isMobileMenuOpen = !isMobileMenuOpen" class="text-foreground p-2">
					<Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
					<X v-else class="w-6 h-6" />
				</button>
			</div>
		</div>

		<!-- Mobile Menu Drawer -->
		<div v-if="isMobileMenuOpen" class="md:hidden absolute top-20 left-0 w-full bg-background border-b border-border/40 shadow-lg py-6 px-6 flex flex-col gap-6 backdrop-blur-xl">
			<NuxtLink to="/about" @click="isMobileMenuOpen = false" class="text-foreground font-display font-medium text-lg">About</NuxtLink>
			<NuxtLink to="/experts" @click="isMobileMenuOpen = false" class="text-foreground font-display font-medium text-lg">Experts Directory</NuxtLink>
			<NuxtLink to="/pricing" @click="isMobileMenuOpen = false" class="text-foreground font-display font-medium text-lg">Pricing</NuxtLink>
			<NuxtLink to="/contact" @click="isMobileMenuOpen = false" class="text-foreground font-display font-medium text-lg">Contact Us</NuxtLink>
			<hr class="border-border/30" />
			<div class="flex flex-col gap-4">
				<NuxtLink to="/login" @click="isMobileMenuOpen = false" class="text-foreground font-medium text-lg text-center py-2 border border-border/50 rounded-xl">Log In</NuxtLink>
				<NuxtLink to="/register" @click="isMobileMenuOpen = false" class="bg-primary text-primary-foreground font-bold text-lg text-center py-3 rounded-xl">Get Started</NuxtLink>
			</div>
		</div>
	</nav>
</template>
