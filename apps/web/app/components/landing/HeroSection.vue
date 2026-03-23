<script setup lang="ts">
// HeroSection component
</script>

<template>
	<section class="pt-32 sm:pt-40 pb-16 sm:pb-20 px-6 sm:px-8 relative overflow-hidden">
		<!-- Background Glow -->
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10"
		></div>

		<div class="max-w-7xl mx-auto flex flex-col items-center text-center">
			<!-- Tagline Badge -->
			<div
				class="mb-8 px-4 py-1 rounded-full bg-secondary border border-border/50 inline-flex items-center gap-2"
			>
				<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
				<span class="font-sans text-xs uppercase tracking-widest text-muted-foreground">
					Architecture of Professionalism
				</span>
			</div>

			<!-- Main Headline -->
			<div class="relative w-full max-w-4xl mx-auto flex justify-center mb-6">
				<!-- Intense green glow precisely behind text -->
				<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-[120%] bg-primary/15 blur-[60px] md:blur-[80px] rounded-full pointer-events-none z-0"></div>
				<h1
					class="relative z-10 font-display text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tighter text-foreground leading-tight w-full drop-shadow-md"
				>
					Expertise on demand. <br />
					<span class="text-transparent bg-clip-text bg-linear-to-r from-primary to-[#19be64]">
						Zero friction.
					</span>
				</h1>
			</div>

			<!-- Subtitle -->
			<p class="text-muted-foreground text-lg md:text-xl max-w-2xl mb-12 font-sans leading-relaxed">
				The ultra-high performance platform for consulting. Secure video, automated workflows, and global talent
				marketplace combined into one fluid experience.
			</p>

			<!-- Search Bar -->
			<div class="w-full max-w-2xl mb-12">
				<div
					class="bg-card p-1.5 sm:p-2 rounded-xl flex items-center shadow-lg shadow-black/5 border border-border/50"
				>
					<span class="material-symbols-outlined ml-2 sm:ml-4 text-muted-foreground hidden sm:block">search</span>
					<input
						class="bg-transparent border-none focus:ring-0 w-full text-foreground px-3 sm:px-4 py-2 sm:py-3 font-sans outline-none text-sm sm:text-base placeholder:text-muted-foreground"
						placeholder="Search for experts..."
						type="text"
					/>
					<button
						class="bg-primary text-primary-foreground px-4 sm:px-8 py-2 sm:py-3 rounded-lg font-bold hover:brightness-110 transition-all shrink-0"
					>
						Search
					</button>
				</div>
			</div>

			<!-- CTAs -->
			<div class="flex flex-col sm:flex-row gap-4">
				<button
					class="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold text-lg hover:shadow-[0_0_30px_-5px_rgb(var(--primary-rgb)_/_0.4)] transition-all"
				>
					Join as Client
				</button>
				<button
					class="px-8 py-4 bg-card border border-border text-foreground rounded-full font-bold text-lg hover:bg-secondary transition-all"
				>
					Apply as Expert
				</button>
			</div>
		</div>
	</section>
</template>
