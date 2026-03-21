<script setup lang="ts">
// PricingSection component
</script>

<template>
	<section class="py-24 px-8 bg-secondary/20" id="pricing">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-20">
				<h2 class="font-display text-4xl font-bold mb-4 text-foreground">
					Simple, transparent pricing
				</h2>
				<p class="text-muted-foreground font-sans">
					We only succeed when you do. No hidden monthly fees or minimums.
				</p>
			</div>
			
			<div class="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
				<!-- Client Card -->
				<div class="bg-card p-10 rounded-3xl border border-border/50 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.1)] transition-all">
					<h3 class="text-2xl font-bold mb-2 font-display text-foreground">For Clients</h3>
					<div class="flex items-baseline gap-1 mb-6">
						<span class="text-5xl font-extrabold text-foreground">Free</span>
					</div>
					<ul class="space-y-4 mb-10 font-sans">
						<li class="flex items-center gap-3 text-muted-foreground">
							<span class="material-symbols-outlined text-primary text-sm">check</span>
							No membership fees
						</li>
						<li class="flex items-center gap-3 text-muted-foreground">
							<span class="material-symbols-outlined text-primary text-sm">check</span>
							Access to global experts
						</li>
						<li class="flex items-center gap-3 text-muted-foreground">
							<span class="material-symbols-outlined text-primary text-sm">check</span>
							Secured escrow payments
						</li>
					</ul>
					<Button variant="outline" class="w-full py-6 rounded-xl font-bold text-base bg-secondary/50 border-border hover:bg-secondary text-foreground" size="lg">
						Join as Client
					</Button>
				</div>
				
				<!-- Expert Card -->
				<div class="bg-card p-10 rounded-3xl border-2 border-primary relative hover:shadow-[0_0_40px_rgba(var(--color-primary),0.15)] transition-all">
					<div class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
						Recommended
					</div>
					<h3 class="text-2xl font-bold mb-2 font-display text-foreground">For Experts</h3>
					<div class="flex items-baseline gap-1 mb-6">
						<span class="text-5xl font-extrabold text-primary">10%</span>
						<span class="text-muted-foreground">per transaction</span>
					</div>
					<ul class="space-y-4 mb-10 font-sans">
						<li class="flex items-center gap-3 text-muted-foreground">
							<span class="material-symbols-outlined text-primary text-sm">check</span>
							Full infrastructure access
						</li>
						<li class="flex items-center gap-3 text-muted-foreground">
							<span class="material-symbols-outlined text-primary text-sm">check</span>
							Verified professional badge
						</li>
						<li class="flex items-center gap-3 text-muted-foreground">
							<span class="material-symbols-outlined text-primary text-sm">check</span>
							Zero marketing costs
						</li>
					</ul>
					<Button class="w-full py-6 rounded-xl font-bold text-base" size="lg">
						Apply as Professional
					</Button>
				</div>
			</div>
		</div>
	</section>
</template>
