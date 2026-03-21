<script setup lang="ts">
// IntelligenceSection component
</script>

<template>
	<section class="py-24 px-8 max-w-7xl mx-auto">
		<h2 class="font-display text-4xl font-bold mb-16 text-center text-foreground">Intelligence built-in</h2>
		<div class="grid md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
			
			<div class="md:col-span-2 md:row-span-2 bg-secondary/50 rounded-3xl p-10 border border-border/10 relative overflow-hidden group">
				<div class="relative z-10">
					<div class="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8">
						<span class="material-symbols-outlined text-3xl">auto_awesome</span>
					</div>
					<h3 class="text-3xl font-bold mb-4 font-display text-foreground">Automated Summaries</h3>
					<p class="text-muted-foreground leading-relaxed mb-8 font-sans">
						Never take notes again. Our proprietary AI engine generates structured summaries, action items,
						and follow-up emails immediately after your session ends.
					</p>
					<div class="bg-secondary p-4 rounded-xl border border-border/10 max-w-sm">
						<p class="text-xs text-primary mb-2 font-bold font-sans">SUMMARY PREVIEW</p>
						<div class="space-y-2">
							<div class="h-2 w-3/4 bg-muted-foreground/20 rounded"></div>
							<div class="h-2 w-full bg-muted-foreground/20 rounded"></div>
							<div class="h-2 w-1/2 bg-muted-foreground/20 rounded"></div>
						</div>
					</div>
				</div>
				<div class="absolute -bottom-10 -right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-all"></div>
			</div>

			<div class="md:col-span-2 bg-card p-8 rounded-3xl border border-border/10 flex items-center gap-8">
				<div class="w-14 h-14 shrink-0 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
					<span class="material-symbols-outlined text-3xl">support_agent</span>
				</div>
				<div>
					<h3 class="text-xl font-bold mb-2 font-display text-foreground">24/7 Concierge Chat</h3>
					<p class="text-muted-foreground text-sm font-sans">Priority support for both clients and experts. Average response time under 3 minutes.</p>
				</div>
			</div>

			<div class="md:col-span-1 bg-card p-8 rounded-3xl border border-border/10">
				<div class="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6">
					<span class="material-symbols-outlined">translate</span>
				</div>
				<h3 class="text-lg font-bold mb-2 font-display text-foreground">Live Translation</h3>
				<p class="text-muted-foreground text-xs font-sans">Real-time captions in 45+ languages.</p>
			</div>

			<div class="md:col-span-1 bg-card p-8 rounded-3xl border border-border/10">
				<div class="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-6">
					<span class="material-symbols-outlined">analytics</span>
				</div>
				<h3 class="text-lg font-bold mb-2 font-display text-foreground">Insight Dashboard</h3>
				<p class="text-muted-foreground text-xs font-sans">Full transparency on earnings and ROI.</p>
			</div>
			
		</div>
	</section>
</template>
