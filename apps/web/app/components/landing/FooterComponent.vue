<script setup lang="ts">
// FooterComponent component
</script>

<template>
	<footer class="bg-background w-full py-16 border-t border-border/50">
		<div class="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-5 gap-12">
			<!-- Brand -->
			<div class="col-span-1 md:col-span-2">
				<div class="flex items-center gap-3 font-display text-3xl font-bold tracking-tighter text-foreground mb-6 group cursor-pointer w-fit">
					<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-primary transform group-hover:rotate-180 transition-all duration-700 ease-in-out">
						<path d="M16 2L2 9L16 16L30 9L16 2Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
						<path d="M2 23L16 30L30 23" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M2 16L16 23L30 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M16 16V30" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					<span>Laxiriir<span class="text-muted-foreground font-normal">.expert</span></span>
				</div>
				<p class="text-muted-foreground font-sans text-sm max-w-xs mb-8">
					Engineering the world's most sophisticated consulting infrastructure.
				</p>
				<div class="flex gap-4">
					<span class="material-symbols-outlined text-muted-foreground hover:text-primary cursor-pointer transition-colors" style="font-variation-settings: 'FILL' 1;">public</span>
					<span class="material-symbols-outlined text-muted-foreground hover:text-primary cursor-pointer transition-colors">alternate_email</span>
				</div>
			</div>
			
			<div>
				<h4 class="text-foreground font-bold mb-6 font-display">Product</h4>
				<ul class="space-y-4">
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/experts">Experts Directory</NuxtLink></li>
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/pricing">Pricing</NuxtLink></li>
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/faq">FAQ</NuxtLink></li>
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/login">Sign In</NuxtLink></li>
				</ul>
			</div>

			<div>
				<h4 class="text-foreground font-bold mb-6 font-display">Company</h4>
				<ul class="space-y-4">
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/about">About Us</NuxtLink></li>
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/contact">Contact Us</NuxtLink></li>
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/register">Create Account</NuxtLink></li>
				</ul>
			</div>

			<div>
				<h4 class="text-foreground font-bold mb-6 font-display">Legal</h4>
				<ul class="space-y-4">
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/privacy">Privacy Policy</NuxtLink></li>
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/terms">Terms of Service</NuxtLink></li>
					<li><NuxtLink class="font-sans text-sm text-muted-foreground hover:text-primary transition-all hover:translate-x-1 inline-block" to="/forgot-password">Password Help</NuxtLink></li>
				</ul>
			</div>
		</div>

		<div class="max-w-7xl mx-auto px-6 md:px-8 mt-16 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
			<p class="font-sans text-sm text-muted-foreground opacity-80">© 2026 Laxiriir Expert. All rights reserved.</p>
			<div class="flex gap-6">
				<span class="text-muted-foreground/80 text-xs font-sans">EN-US</span>
				<span class="text-muted-foreground/80 text-xs font-sans">STATUS: OPERATIONAL</span>
			</div>
		</div>
	</footer>
</template>
