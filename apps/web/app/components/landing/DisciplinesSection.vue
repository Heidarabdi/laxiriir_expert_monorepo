<script setup lang="ts">
// DisciplinesSection component
import { ref } from 'vue'

const activeTab = ref('Healthcare')
const tabs = ['Healthcare', 'Spiritual', 'Business', 'Legal']
</script>

<template>
	<section class="py-16 md:py-24 px-6 md:px-8 max-w-7xl mx-auto" id="disciplines">
		<div class="text-center mb-16">
			<h2 class="font-display text-3xl sm:text-4xl font-bold mb-6 text-foreground">
				A platform for every discipline
			</h2>
			<div class="flex justify-center gap-4 flex-wrap">
				<button
					v-for="tab in tabs"
					:key="tab"
					@click="activeTab = tab"
					class="px-6 py-2 rounded-full font-bold transition-all"
					:class="activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground hover:bg-accent'"
				>
					{{ tab }}
				</button>
			</div>
		</div>

		<!-- Dynamic content area -->
		<div
			class="bg-secondary/50 rounded-3xl p-6 sm:p-8 md:p-12 grid md:grid-cols-2 gap-8 md:gap-12 items-center border border-border/10"
		>
			<div class="space-y-6">
				<div
					class="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest"
				>
					<span v-if="activeTab === 'Healthcare'">Medical & Therapy</span>
					<span v-else-if="activeTab === 'Spiritual'">Spiritual Guidance</span>
					<span v-else-if="activeTab === 'Business'">Strategy & Advising</span>
					<span v-else-if="activeTab === 'Legal'">Law & Contracts</span>
				</div>
				<h3 class="text-3xl sm:text-4xl font-display font-bold text-foreground">
					<span v-if="activeTab === 'Healthcare'">Confidential Medical consultations.</span>
					<span v-else-if="activeTab === 'Spiritual'">Meaningful spiritual connections.</span>
					<span v-else-if="activeTab === 'Business'">High-definition strategy rooms.</span>
					<span v-else-if="activeTab === 'Legal'">Secure legal counsel capabilities.</span>
				</h3>
				<p class="text-muted-foreground text-lg leading-relaxed font-sans">
					<span v-if="activeTab === 'Healthcare'">
						HIPAA-ready infrastructure for doctors, therapists, and nutritionists to connect with patients worldwide.
					</span>
					<span v-else-if="activeTab === 'Spiritual'">
						A dignified, private environment for consulting with verified scholars and religious counselors.
					</span>
					<span v-else-if="activeTab === 'Business'">
						High-definition screen sharing and whiteboarding for business strategy and financial planning.
					</span>
					<span v-else-if="activeTab === 'Legal'">
						Sign NDAs and review documents securely in a fully encrypted and compliant video room.
					</span>
				</p>
				<div class="pt-4">
					<button class="flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all">
						Browse Experts <span class="material-symbols-outlined">arrow_forward</span>
					</button>
				</div>
			</div>
			
			<div class="grid grid-cols-2 gap-4">
				<div class="aspect-square rounded-2xl bg-muted overflow-hidden shadow-lg shadow-black/5 border border-border/20">
					<img
						alt="Expert working"
						class="w-full h-full object-cover grayscale"
						src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500"
					/>
				</div>
				<div class="aspect-square rounded-2xl bg-muted overflow-hidden mt-8 shadow-lg shadow-black/5 border border-border/20">
					<img
						alt="Virtual session"
						class="w-full h-full object-cover grayscale"
						src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"
					/>
				</div>
			</div>
		</div>
	</section>
</template>
