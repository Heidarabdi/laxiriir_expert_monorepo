<script setup lang="ts">
// ExpertsSection component
</script>

<template>
	<section class="py-16 md:py-24 px-6 md:px-8 bg-background">
		<div class="max-w-7xl mx-auto">
			<div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-6 md:gap-8">
				<div class="max-w-xl">
					<h2 class="font-display text-3xl sm:text-4xl font-bold mb-4 text-foreground">Verified Experts</h2>
					<p class="text-muted-foreground font-sans">
						Access the top 1% of practitioners. Every expert undergoes a rigorous vetting process including identity
						verification and credential auditing.
					</p>
				</div>
				<button class="px-8 py-3 bg-secondary border border-border/20 rounded-full font-bold hover:bg-accent transition-all text-foreground">
					View All Experts
				</button>
			</div>

			<div class="grid md:grid-cols-3 gap-8">
				<!-- Expert 1 -->
				<div class="bg-card p-6 rounded-2xl border border-border/20 hover:border-primary/40 transition-all group">
					<div class="relative mb-6">
						<div class="aspect-4/5 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
							<img
								alt="Female medical professional portrait"
								class="w-full h-full object-cover"
								src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800"
							/>
						</div>
						<div class="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
							<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
							VERIFIED
						</div>
					</div>
					<h4 class="text-xl font-bold mb-1 font-display text-foreground">Dr. Sarah Jensen</h4>
					<p class="text-primary text-sm font-bold mb-4 font-sans">Functional Medicine</p>
					<div class="flex items-center gap-2 mb-6">
						<span class="material-symbols-outlined text-yellow-500 text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
						<span class="text-sm font-bold text-foreground">4.9</span>
						<span class="text-muted-foreground text-sm font-sans">(124 reviews)</span>
					</div>
					<button class="w-full py-3 bg-secondary rounded-lg font-bold hover:bg-primary hover:text-primary-foreground transition-all text-foreground">
						Book Consultation
					</button>
				</div>

				<!-- Expert 2 -->
				<div class="bg-card p-6 rounded-2xl border border-border/20 hover:border-primary/40 transition-all group">
					<div class="relative mb-6">
						<div class="aspect-4/5 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
							<img
								alt="Male business consultant portrait"
								class="w-full h-full object-cover"
								src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?w=800"
							/>
						</div>
						<div class="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
							<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
							VERIFIED
						</div>
					</div>
					<h4 class="text-xl font-bold mb-1 font-display text-foreground">Marcus Thorne</h4>
					<p class="text-primary text-sm font-bold mb-4 font-sans">Strategic Expansion</p>
					<div class="flex items-center gap-2 mb-6">
						<span class="material-symbols-outlined text-yellow-500 text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
						<span class="text-sm font-bold text-foreground">5.0</span>
						<span class="text-muted-foreground text-sm font-sans">(89 reviews)</span>
					</div>
					<button class="w-full py-3 bg-secondary rounded-lg font-bold hover:bg-primary hover:text-primary-foreground transition-all text-foreground">
						Book Consultation
					</button>
				</div>

				<!-- Expert 3 -->
				<div class="bg-card p-6 rounded-2xl border border-border/20 hover:border-primary/40 transition-all group">
					<div class="relative mb-6">
						<div class="aspect-4/5 rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
							<img
								alt="Female legal professional portrait"
								class="w-full h-full object-cover"
								src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800"
							/>
						</div>
						<div class="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
							<span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">verified</span>
							VERIFIED
						</div>
					</div>
					<h4 class="text-xl font-bold mb-1 font-display text-foreground">Elena Rodriguez</h4>
					<p class="text-primary text-sm font-bold mb-4 font-sans">Corporate Law</p>
					<div class="flex items-center gap-2 mb-6">
						<span class="material-symbols-outlined text-yellow-500 text-sm" style="font-variation-settings: 'FILL' 1;">star</span>
						<span class="text-sm font-bold text-foreground">4.8</span>
						<span class="text-muted-foreground text-sm font-sans">(210 reviews)</span>
					</div>
					<button class="w-full py-3 bg-secondary rounded-lg font-bold hover:bg-primary hover:text-primary-foreground transition-all text-foreground">
						Book Consultation
					</button>
				</div>
			</div>
		</div>
	</section>
</template>
