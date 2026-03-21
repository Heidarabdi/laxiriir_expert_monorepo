<script setup lang="ts">
// InfrastructureSection component
</script>

<template>
	<section class="py-24 px-8 max-w-7xl mx-auto" id="features">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Header -->
			<div class="lg:col-span-1">
				<h2 class="font-display text-4xl font-bold tracking-tight mb-6">
					Infrastructure for consultations
				</h2>
				<p class="text-muted-foreground leading-relaxed font-sans">
					We provide the technical bedrock so you can focus on providing value. Built for precision and absolute
					reliability.
				</p>
			</div>

			<!-- Grid -->
			<div class="lg:col-span-2 grid md:grid-cols-3 gap-6">
				<!-- Item 1 -->
				<div
					class="bg-secondary/50 p-8 rounded-xl border border-border/5 hover:border-primary/20 transition-all group"
				>
					<div
						class="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform"
					>
						<span class="material-symbols-outlined">calendar_today</span>
					</div>
					<h3 class="text-xl font-bold mb-3 font-display text-foreground">Live Availability</h3>
					<p class="text-muted-foreground text-sm leading-relaxed font-sans">
						Real-time synchronization across all your professional calendars.
					</p>
				</div>

				<!-- Item 2 -->
				<div
					class="bg-secondary/50 p-8 rounded-xl border border-border/5 hover:border-primary/20 transition-all group"
				>
					<div
						class="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform"
					>
						<span class="material-symbols-outlined">payments</span>
					</div>
					<h3 class="text-xl font-bold mb-3 font-display text-foreground">Escrow Payments</h3>
					<p class="text-muted-foreground text-sm leading-relaxed font-sans">
						Funds are secured before the session begins. Frictionless transfers.
					</p>
				</div>

				<!-- Item 3 -->
				<div
					class="bg-secondary/50 p-8 rounded-xl border border-border/5 hover:border-primary/20 transition-all group"
				>
					<div
						class="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform"
					>
						<span class="material-symbols-outlined">lock</span>
					</div>
					<h3 class="text-xl font-bold mb-3 font-display text-foreground">End-to-End Encrypted</h3>
					<p class="text-muted-foreground text-sm leading-relaxed font-sans">
						Military-grade encryption for all video and data exchanges.
					</p>
				</div>
			</div>
		</div>
	</section>
</template>
