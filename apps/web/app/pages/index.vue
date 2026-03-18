<script setup lang="ts">
import type { Component } from "vue";
import {
	ArrowRight,
	BadgeCheck,
	CalendarCheck2,
	CreditCard,
	LayoutDashboard,
	Lock,
	ShieldCheck,
	Sparkles,
	Stethoscope,
	UserRound,
	Video,
} from "lucide-vue-next";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

useSeoMeta({
	description:
		"Video-first consultation platform for secure booking, payments, reminders, and expert sessions.",
	title: "Laxiriir Expert",
});

interface RolePreview {
	icon: Component;
	label: string;
	points: string[];
	title: string;
}

interface FeatureCard {
	copy: string;
	icon: Component;
	title: string;
}

interface TrustSignal {
	copy: string;
	icon: Component;
	title: string;
}

const brandMarks = ["HealthPlus", "Al-Hikmah", "GlobalLaw", "Apex Advisors"];

const rolePreviews: RolePreview[] = [
	{
		icon: LayoutDashboard,
		label: "Admin",
		points: [
			"Operations, trust, payout holds, and live marketplace health.",
			"Built like a product surface instead of a forgotten back-office screen.",
		],
		title: "Admin command center",
	},
	{
		icon: Stethoscope,
		label: "Expert",
		points: [
			"Availability, session prep, follow-up, and payouts in one workspace.",
			"Designed for doctors, advisors, scholars, and specialist consultants.",
		],
		title: "Expert studio",
	},
	{
		icon: UserRound,
		label: "Client",
		points: [
			"Booking, reminders, room access, and summaries in one guided flow.",
			"Feels calm and premium instead of looking like a generic account area.",
		],
		title: "Client dashboard",
	},
];

const featureCards: FeatureCard[] = [
	{
		copy:
			"Clients see real-time availability, pick a slot, and pay without losing context. The experience stays premium instead of becoming transactional.",
		icon: CalendarCheck2,
		title: "Frictionless scheduling and payments",
	},
	{
		copy:
			"Sessions happen inside a secure product surface instead of a disconnected third-party handoff. The room is part of the brand.",
		icon: Video,
		title: "Bank-grade video rooms",
	},
	{
		copy:
			"Verification, support, and payouts are visible parts of the product system. Trust is designed into the workflow.",
		icon: ShieldCheck,
		title: "Operational trust built in",
	},
];

const trustSignals: TrustSignal[] = [
	{
		copy: "Serious compliance posture for sensitive consultations and records.",
		icon: ShieldCheck,
		title: "HIPAA and GDPR ready",
	},
	{
		copy: "Secure room flows that feel native to the platform instead of bolted on.",
		icon: Lock,
		title: "Encrypted video sessions",
	},
	{
		copy: "Booking confidence, deposits, and payout logic designed into the product.",
		icon: CreditCard,
		title: "PCI-conscious payments",
	},
];

const audienceSteps = {
	client: [
		{
			copy:
				"Search by specialty, review trust signals, and choose the right professional.",
			number: "1",
			title: "Find an expert",
		},
		{
			copy:
				"Choose a time slot, confirm payment, and receive reminders with room access.",
			number: "2",
			title: "Book and pay securely",
		},
		{
			copy:
				"Join the session in-platform and receive clean follow-up steps afterwards.",
			number: "3",
			title: "Join the video session",
		},
	],
	expert: [
		{
			copy:
				"Set rates, define availability, and present credentials in a premium profile.",
			number: "1",
			title: "Create your expert profile",
		},
		{
			copy:
				"Prepare, host, and document the session from one studio instead of separate tools.",
			number: "2",
			title: "Run the consultation",
		},
		{
			copy:
				"Track payouts, follow-ups, and repeat bookings without breaking your workflow.",
			number: "3",
			title: "Get paid and rebook",
		},
	],
} as const;
</script>

<template>
	<div class="min-h-screen bg-background text-foreground">
		<header
			class="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80"
		>
			<div
				class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8"
			>
				<AppBrand subtitle="Video-first consultation platform" />
				<nav class="hidden items-center gap-6 lg:flex">
					<a class="text-sm text-muted-foreground transition hover:text-foreground" href="#previews">
						Previews
					</a>
					<a class="text-sm text-muted-foreground transition hover:text-foreground" href="#features">
						Features
					</a>
					<a
						class="text-sm text-muted-foreground transition hover:text-foreground"
						href="#how-it-works"
					>
						How It Works
					</a>
				</nav>
				<div class="hidden items-center gap-3 sm:flex">
					<Button as-child variant="ghost">
						<a href="#previews">Product view</a>
					</Button>
					<Button as-child>
						<a href="#how-it-works">
							Get started
							<ArrowRight class="size-4" />
						</a>
					</Button>
				</div>
			</div>
		</header>

		<main>
			<section class="border-b border-border">
				<div
					class="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24"
				>
					<div class="flex flex-col gap-8">
						<Badge class="gap-2" variant="outline">
							<Sparkles class="size-3.5" />
							The professional standard for virtual consultations
						</Badge>
						<div class="flex flex-col gap-5">
							<h1
								class="max-w-4xl font-display text-5xl font-semibold tracking-tight text-foreground md:text-6xl lg:text-7xl"
							>
								Connect with world-class experts.
								<span class="text-primary">Securely and instantly.</span>
							</h1>
							<p class="max-w-2xl text-lg leading-8 text-muted-foreground">
								An all-in-one platform for serious professionals. Book appointments,
								process payments, and host secure video sessions with verified doctors,
								advisors, scholars, and specialist experts.
							</p>
						</div>
						<div class="flex flex-wrap items-center gap-3">
							<Button as-child size="lg">
								<a href="#previews">
									Get started
									<ArrowRight class="size-4" />
								</a>
							</Button>
							<Button as-child size="lg" variant="outline">
								<a href="#how-it-works">Apply as an expert</a>
							</Button>
						</div>
						<div class="grid gap-4 sm:grid-cols-3">
							<Card class="gap-4">
								<CardHeader class="px-5 pb-0">
									<CardDescription>Verified experts</CardDescription>
									<CardTitle class="font-display text-2xl">420+</CardTitle>
								</CardHeader>
								<CardContent class="px-5 pt-0 text-sm text-muted-foreground">
									Medical, legal, advisory, and faith-based consultations.
								</CardContent>
							</Card>
							<Card class="gap-4">
								<CardHeader class="px-5 pb-0">
									<CardDescription>Booking confidence</CardDescription>
									<CardTitle class="font-display text-2xl">98.2%</CardTitle>
								</CardHeader>
								<CardContent class="px-5 pt-0 text-sm text-muted-foreground">
									Timezone-safe scheduling, reminders, and payment confirmation.
								</CardContent>
							</Card>
							<Card class="gap-4">
								<CardHeader class="px-5 pb-0">
									<CardDescription>Trust-first ops</CardDescription>
									<CardTitle class="font-display text-2xl">24/7</CardTitle>
								</CardHeader>
								<CardContent class="px-5 pt-0 text-sm text-muted-foreground">
									Live oversight for payouts, room access, and sensitive categories.
								</CardContent>
							</Card>
						</div>
					</div>

					<Card class="overflow-hidden py-0">
						<CardHeader class="gap-0 border-b border-border px-0 py-0">
							<div
								class="flex items-center gap-3 border-b border-border bg-muted/30 px-5 py-4"
							>
								<div class="flex items-center gap-2">
									<span class="size-3 rounded-full bg-red-400"></span>
									<span class="size-3 rounded-full bg-amber-400"></span>
									<span class="size-3 rounded-full bg-emerald-400"></span>
								</div>
								<div
									class="ml-auto flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
								>
									<Lock class="size-3.5 text-primary" />
									app.laxiriir.expert/room/dr-amina
								</div>
							</div>
						</CardHeader>
						<CardContent class="grid gap-4 p-5 lg:grid-cols-[1.25fr_0.75fr]">
							<Card class="gap-4 border-none bg-ink-950 py-0 text-white shadow-sm">
								<CardContent class="flex h-full flex-col gap-6 p-5">
									<div class="flex items-start justify-between gap-4">
										<div class="flex flex-col gap-2">
											<Badge class="w-fit gap-2" variant="secondary">
												Live consultation
											</Badge>
											<div>
												<p class="font-display text-2xl font-semibold">
													Respiratory follow-up
												</p>
												<p class="mt-1 text-sm text-white/65">
													Dr. Amina Khalid with Asha Yusuf
												</p>
											</div>
										</div>
										<div class="rounded-2xl border border-white/10 bg-white/5 p-3">
											<div
												class="flex aspect-video w-28 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xs text-white/65"
											>
												Client view
											</div>
										</div>
									</div>
									<div class="grid gap-4 md:grid-cols-[1fr_auto]">
										<div class="rounded-2xl border border-white/10 bg-white/5 p-4">
											<p class="text-sm font-medium text-white/70">Session status</p>
											<p class="mt-2 text-2xl font-semibold">41 min remaining</p>
											<p class="mt-3 text-sm leading-6 text-white/60">
												Payment is confirmed, room access is active, and intake notes are
												ready for the expert.
											</p>
										</div>
										<div class="flex items-end gap-2">
											<Avatar class="size-10 border border-white/10">
												<AvatarFallback class="bg-white/10 text-white">AK</AvatarFallback>
											</Avatar>
											<Avatar class="size-10 border border-white/10">
												<AvatarFallback class="bg-white/10 text-white">AY</AvatarFallback>
											</Avatar>
										</div>
									</div>
									<div class="flex items-center gap-3">
										<Button size="icon" variant="outline">
											<BadgeCheck class="size-4" />
										</Button>
										<Button size="icon" variant="outline">
											<Video class="size-4" />
										</Button>
										<Button variant="destructive">End call</Button>
									</div>
								</CardContent>
							</Card>

							<div class="flex flex-col gap-4">
								<Card class="gap-4">
									<CardHeader class="px-5 pb-0">
										<CardDescription>Upcoming booking</CardDescription>
										<CardTitle class="font-display text-2xl">Friday, 18:30 EAT</CardTitle>
									</CardHeader>
									<CardContent class="px-5 pt-0 text-sm leading-6 text-muted-foreground">
										Respiratory follow-up with payment confirmation, reminders, and secure
										room access already prepared.
									</CardContent>
								</Card>

								<Card class="gap-4">
									<CardHeader class="px-5 pb-0">
										<CardDescription>Role previews</CardDescription>
										<CardTitle class="font-display text-xl">One system, three roles</CardTitle>
									</CardHeader>
									<CardContent class="flex flex-col gap-3 px-5 pt-0">
										<Button
											v-for="role in rolePreviews"
											:key="role.title"
											class="justify-between"
											variant="outline"
										>
											<span>{{ role.title }}</span>
											<span class="text-xs uppercase tracking-[0.18em]">Preview</span>
										</Button>
									</CardContent>
								</Card>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			<section class="border-b border-border bg-muted/20">
				<div
					class="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-4 py-8 sm:px-6 lg:px-8"
				>
					<Badge
						v-for="brand in brandMarks"
						:key="brand"
						class="rounded-full px-4 py-2 text-sm"
						variant="secondary"
					>
						{{ brand }}
					</Badge>
				</div>
			</section>

			<section id="previews" class="py-20 sm:py-24">
				<div class="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
					<div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div class="flex max-w-3xl flex-col gap-3">
							<Badge class="w-fit" variant="outline">Product previews</Badge>
							<h2 class="font-display text-3xl font-semibold tracking-tight md:text-4xl">
								The same system carried into the important product pages.
							</h2>
						</div>
						<p class="max-w-2xl text-sm leading-7 text-muted-foreground">
							These are the core surfaces you asked for: admin, expert, and client. The
							goal is one consistent language across marketing, scheduling, video, and
							operations.
						</p>
					</div>

					<div class="grid gap-5 lg:grid-cols-3">
						<Card v-for="role in rolePreviews" :key="role.title" class="gap-5">
							<CardHeader class="flex flex-col gap-5 px-6 pb-0">
								<div class="flex items-start justify-between gap-4">
									<div class="flex size-12 items-center justify-center rounded-xl bg-muted">
										<component :is="role.icon" class="size-5 text-primary" />
									</div>
									<Badge variant="outline">{{ role.label }}</Badge>
								</div>
								<div class="flex flex-col gap-2">
									<CardTitle class="font-display text-3xl">{{ role.title }}</CardTitle>
									<CardDescription class="text-sm leading-6">
										Important workflow surfaces should feel like product, not like support
										tools.
									</CardDescription>
								</div>
							</CardHeader>
							<CardContent class="flex flex-col gap-4 px-6 pt-0">
								<div
									v-for="point in role.points"
									:key="point"
									class="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
								>
									<span class="mt-2 size-2 rounded-full bg-primary"></span>
									<span>{{ point }}</span>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section id="features" class="border-y border-border bg-muted/20 py-20 sm:py-24">
				<div class="mx-auto flex max-w-7xl flex-col gap-16 px-4 sm:px-6 lg:px-8">
					<div class="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
						<Card class="gap-5">
							<CardHeader class="px-6 pb-0">
								<CardDescription>Booking flow</CardDescription>
								<CardTitle class="font-display text-3xl">
									Calendar, payment, and reminders in one surface
								</CardTitle>
							</CardHeader>
							<CardContent class="flex flex-col gap-4 px-6 pt-0">
								<Card class="gap-3 bg-muted/30">
									<CardContent class="flex flex-col gap-3 p-4">
										<div class="text-sm font-medium">Tuesday 19:00 EAT</div>
										<div class="text-sm text-muted-foreground">
											High-intent cardiology slot with instant confirmation.
										</div>
									</CardContent>
								</Card>
								<Card class="gap-3 bg-muted/30">
									<CardContent class="flex flex-col gap-3 p-4">
										<div class="text-sm font-medium">Thursday 11:30 EAT</div>
										<div class="text-sm text-muted-foreground">
											Advisory follow-up slot with reminder sequence prepared.
										</div>
									</CardContent>
								</Card>
								<Button>Confirm slot and pay $150</Button>
							</CardContent>
						</Card>

						<div class="flex flex-col gap-6">
							<div class="flex size-12 items-center justify-center rounded-xl bg-muted">
								<CalendarCheck2 class="size-5 text-primary" />
							</div>
							<div class="flex flex-col gap-4">
								<h3 class="font-display text-3xl font-semibold tracking-tight md:text-4xl">
									Frictionless scheduling and payments
								</h3>
								<p class="max-w-2xl text-lg leading-8 text-muted-foreground">
									Clients view real-time availability and book slots instantly. The
									product handles timezone math, reminders, and payment confidence without
									forcing users through a messy flow.
								</p>
							</div>
						</div>
					</div>

					<div class="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
						<div class="flex flex-col gap-6">
							<div class="flex size-12 items-center justify-center rounded-xl bg-muted">
								<Video class="size-5 text-primary" />
							</div>
							<div class="flex flex-col gap-4">
								<h3 class="font-display text-3xl font-semibold tracking-tight md:text-4xl">
									Bank-grade video rooms
								</h3>
								<p class="max-w-2xl text-lg leading-8 text-muted-foreground">
									The video room is part of the product, not an afterthought. That matters
									for trust-heavy categories like medical, faith, legal, and advisory
									sessions.
								</p>
							</div>
						</div>

						<Card class="gap-5 bg-ink-950 text-white">
							<CardHeader class="flex flex-col gap-3 px-6 pb-0">
								<Badge class="w-fit" variant="secondary">End-to-end encrypted</Badge>
								<CardTitle class="font-display text-3xl text-white">
									Secure room experience
								</CardTitle>
								<CardDescription class="text-white/65">
									Participants, notes, room controls, and follow-up context all stay
									inside one polished product surface.
								</CardDescription>
							</CardHeader>
							<CardContent class="px-6 pt-0">
								<div class="rounded-2xl border border-white/10 bg-white/5 p-5">
									<p class="text-sm font-medium text-white/80">Room controls</p>
									<Separator class="my-4 bg-white/10" />
									<div class="grid gap-3 text-sm text-white/65 sm:grid-cols-3">
										<div>Identity verified</div>
										<div>Recording disabled</div>
										<div>Post-session summary ready</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div class="grid gap-5 lg:grid-cols-3">
						<Card v-for="feature in featureCards" :key="feature.title" class="gap-5">
							<CardHeader class="px-6 pb-0">
								<div class="flex size-12 items-center justify-center rounded-xl bg-muted">
									<component :is="feature.icon" class="size-5 text-primary" />
								</div>
								<CardTitle class="font-display text-2xl">{{ feature.title }}</CardTitle>
							</CardHeader>
							<CardContent class="px-6 pt-0 text-sm leading-7 text-muted-foreground">
								{{ feature.copy }}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section class="py-20 sm:py-24">
				<div class="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
					<div class="flex flex-col gap-3 text-center">
						<Badge class="mx-auto w-fit" variant="outline">High-trust foundations</Badge>
						<h3 class="font-display text-3xl font-semibold tracking-tight md:text-4xl">
							The platform is built for sensitive, trust-heavy consultations.
						</h3>
					</div>

					<div class="grid gap-5 md:grid-cols-3">
						<Card v-for="signal in trustSignals" :key="signal.title" class="gap-5">
							<CardHeader class="px-6 pb-0">
								<div class="flex size-12 items-center justify-center rounded-xl bg-muted">
									<component :is="signal.icon" class="size-5 text-primary" />
								</div>
								<CardTitle class="font-display text-2xl">{{ signal.title }}</CardTitle>
							</CardHeader>
							<CardContent class="px-6 pt-0 text-sm leading-7 text-muted-foreground">
								{{ signal.copy }}
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			<section id="how-it-works" class="border-y border-border bg-muted/20 py-20 sm:py-24">
				<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div class="flex flex-col gap-10">
						<div class="flex flex-col gap-4 text-center">
							<Badge class="mx-auto w-fit" variant="outline">How it works</Badge>
							<h3 class="font-display text-3xl font-semibold tracking-tight md:text-4xl">
								A guided flow for both clients and experts.
							</h3>
						</div>

						<Tabs class="gap-8" default-value="client">
							<div class="flex justify-center">
								<TabsList class="h-auto rounded-full p-1">
									<TabsTrigger class="rounded-full px-5" value="client">
										For clients
									</TabsTrigger>
									<TabsTrigger class="rounded-full px-5" value="expert">
										For experts
									</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent value="client">
								<div class="grid gap-5 md:grid-cols-3">
									<Card v-for="step in audienceSteps.client" :key="step.title" class="gap-4">
										<CardHeader class="items-center px-6 pb-0 text-center">
											<div
												class="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
											>
												{{ step.number }}
											</div>
											<CardTitle class="font-display text-2xl">{{ step.title }}</CardTitle>
										</CardHeader>
										<CardContent class="px-6 pt-0 text-center text-sm leading-7 text-muted-foreground">
											{{ step.copy }}
										</CardContent>
									</Card>
								</div>
							</TabsContent>

							<TabsContent value="expert">
								<div class="grid gap-5 md:grid-cols-3">
									<Card v-for="step in audienceSteps.expert" :key="step.title" class="gap-4">
										<CardHeader class="items-center px-6 pb-0 text-center">
											<div
												class="flex size-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground"
											>
												{{ step.number }}
											</div>
											<CardTitle class="font-display text-2xl">{{ step.title }}</CardTitle>
										</CardHeader>
										<CardContent class="px-6 pt-0 text-center text-sm leading-7 text-muted-foreground">
											{{ step.copy }}
										</CardContent>
									</Card>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</section>

			<section class="py-20 sm:py-24">
				<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<Card class="gap-8 px-2 sm:px-4">
						<CardHeader class="items-center px-6 pb-0 text-center">
							<Badge variant="outline">Ready to elevate your consultations?</Badge>
							<CardTitle class="max-w-3xl font-display text-3xl md:text-5xl">
								Start with the public product direction and carry the same system into the
								real application.
							</CardTitle>
							<CardDescription class="max-w-2xl text-base leading-7">
								Build one trustworthy interface language for booking, sessions, payments,
								and operations instead of separate disconnected screens.
							</CardDescription>
						</CardHeader>
						<CardContent class="flex flex-wrap items-center justify-center gap-3 px-6 pt-0">
							<Button as-child size="lg">
								<a href="#previews">Explore role views</a>
							</Button>
							<Button as-child size="lg" variant="outline">
								<a href="#how-it-works">See user flows</a>
							</Button>
						</CardContent>
					</Card>
				</div>
			</section>
		</main>

		<footer class="border-t border-border bg-muted/20 py-16">
			<div class="mx-auto flex max-w-7xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
				<div class="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
					<div class="flex flex-col gap-5">
						<AppBrand subtitle="Premium consultation software" />
						<p class="max-w-md text-sm leading-7 text-muted-foreground">
							The premier SaaS marketplace connecting individuals with verified experts
							through secure, high-trust video consultations.
						</p>
					</div>

					<div class="flex flex-col gap-4">
						<h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
							Product
						</h3>
						<div class="flex flex-col gap-3 text-sm">
							<a class="text-muted-foreground transition hover:text-foreground" href="#features">
								Features
							</a>
							<a
								class="text-muted-foreground transition hover:text-foreground"
								href="#how-it-works"
							>
								How it works
							</a>
							<a class="text-muted-foreground transition hover:text-foreground" href="#previews">
								Previews
							</a>
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
							Roles
						</h3>
						<div class="flex flex-col gap-3 text-sm text-muted-foreground">
							<span>Admin</span>
							<span>Expert</span>
							<span>Client</span>
						</div>
					</div>

					<div class="flex flex-col gap-4">
						<h3 class="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
							Trust
						</h3>
						<div class="flex flex-col gap-3 text-sm text-muted-foreground">
							<span>Encrypted sessions</span>
							<span>Payment confidence</span>
							<span>Verified expertise</span>
						</div>
					</div>
				</div>

				<Separator />

				<div class="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:justify-between">
					<p>© 2026 Laxiriir Expert. Built for trust-heavy consultations.</p>
					<div class="flex items-center gap-5">
						<a class="transition hover:text-foreground" href="#features">Product</a>
						<a class="transition hover:text-foreground" href="#previews">Previews</a>
						<a class="transition hover:text-foreground" href="#how-it-works">Flows</a>
					</div>
				</div>
			</div>
		</footer>
	</div>
</template>
