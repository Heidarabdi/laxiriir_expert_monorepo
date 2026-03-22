<script setup lang="ts">
// CTASection component
</script>

<template>
	<section class="py-16 md:py-24 px-6 md:px-8 relative overflow-hidden">
		<div class="max-w-7xl mx-auto bg-linear-to-br from-primary/10 to-transparent rounded-4xl md:rounded-[3rem] p-8 sm:p-12 md:p-16 border border-primary/10 text-center relative z-10 backdrop-blur-sm">
			<h2 class="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold mb-6 md:mb-8 tracking-tighter text-foreground">
				Ready to get started?
			</h2>
			<p class="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-sans">
				Join thousands of professionals and clients building the future of digital architecture.
			</p>
			<div class="flex flex-col sm:flex-row gap-6 justify-center">
				<button class="px-10 py-5 bg-primary text-primary-foreground rounded-full font-extrabold text-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
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
