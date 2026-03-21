<script setup lang="ts">
// VideoSection component
</script>

<template>
	<section class="py-24 px-8 bg-secondary/50">
		<div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
			
			<!-- Video Player Mockup -->
			<div class="order-2 lg:order-1">
				<div class="aspect-video bg-muted rounded-2xl overflow-hidden relative shadow-2xl group border border-border/20">
					<img
						alt="Professional video conferencing interface"
						class="w-full h-full object-cover opacity-60"
						src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80"
					/>
					
					<!-- Play Button -->
					<div class="absolute inset-0 flex items-center justify-center">
						<div
							class="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground cursor-pointer hover:scale-110 transition-transform shadow-xl"
						>
							<span class="material-symbols-outlined text-4xl" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
						</div>
					</div>

					<!-- Status Overlay -->
					<div
						class="absolute bottom-6 left-6 right-6 h-12 bg-background/60 backdrop-blur-xl rounded-lg flex items-center px-4 gap-4"
					>
						<div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
						<span class="text-xs font-mono text-white/80 tracking-wider">
							LIVE SESSION: 1080P_ULTRA_ENCRYPTED
						</span>
					</div>
				</div>
			</div>

			<!-- Text Content -->
			<div class="order-1 lg:order-2">
				<h2 class="font-display text-4xl md:text-5xl font-extrabold tracking-tight mb-8 text-foreground">
					Crystal clear video. <br />
					<span class="text-primary">Built-in.</span>
				</h2>
				<p class="text-muted-foreground text-lg mb-8 leading-relaxed font-sans">
					No third-party apps. No browser extensions. Launch high-definition consulting sessions directly
					from your dashboard with one click.
				</p>
				<ul class="space-y-4">
					<li class="flex items-center gap-3 text-foreground font-medium font-sans">
						<span class="material-symbols-outlined text-primary">check_circle</span>
						Sub-100ms latency globally
					</li>
					<li class="flex items-center gap-3 text-foreground font-medium font-sans">
						<span class="material-symbols-outlined text-primary">check_circle</span>
						Integrated screen sharing & file transfers
					</li>
					<li class="flex items-center gap-3 text-foreground font-medium font-sans">
						<span class="material-symbols-outlined text-primary">check_circle</span>
						Session auto-archiving options
					</li>
				</ul>
			</div>

		</div>
	</section>
</template>
