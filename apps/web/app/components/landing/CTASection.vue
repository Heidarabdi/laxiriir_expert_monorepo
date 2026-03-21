<script setup lang="ts">
// CTASection component
</script>

<template>
	<section class="py-24 px-8 relative overflow-hidden">
		<div class="max-w-7xl mx-auto bg-linear-to-br from-primary/20 to-secondary/10 rounded-[3rem] p-16 border border-primary/10 text-center relative z-10 backdrop-blur-sm">
			<h2 class="font-display text-4xl md:text-6xl font-extrabold mb-8 tracking-tighter text-foreground">
				Ready to get started?
			</h2>
			<p class="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-sans">
				Join thousands of professionals and clients building the future of digital architecture.
			</p>
			<div class="flex flex-col sm:flex-row gap-6 justify-center">
				<button class="px-10 py-5 bg-primary text-primary-foreground rounded-full font-extrabold text-xl shadow-2xl hover:scale-105 transition-transform">
					Find an Expert
				</button>
				<button class="px-10 py-5 bg-background text-foreground rounded-full font-extrabold text-xl border border-border hover:bg-card transition-all">
					Apply as Professional
				</button>
			</div>
		</div>
		<!-- Decorative blur background -->
		<div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 translate-y-1/2"></div>
	</section>
</template>
