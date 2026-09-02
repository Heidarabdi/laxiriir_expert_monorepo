import { Link, useNavigate } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	BotIcon,
	CalendarIcon,
	CheckIcon,
	CreditCardIcon,
	GlobeIcon,
	LockIcon,
	MicIcon,
	PhoneOffIcon,
	SearchIcon,
	Share2Icon,
	ShieldCheckIcon,
	SparklesIcon,
	StarIcon,
	UserRoundIcon,
	VideoIcon,
	ZapIcon,
} from "lucide-react";

import { PublicShell } from "@/components/public-shell";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useExperts } from "@/hooks/use-consultations";
import { formatPrice } from "@/lib/format";

const features = [
	{
		copy: "Zero downloads, zero Zoom links. Join crystal-clear, end-to-end encrypted consultations with sub-100ms global WebRTC latency.",
		icon: VideoIcon,
		footerIcon: ZapIcon,
		tag: "1080p 60FPS • Encrypted",
		title: "Browser-Native HD Video Rooms",
		tone: "video",
	},
	{
		copy: "Client payments are safely held in escrow until the session is completed and confirmed by both parties.",
		icon: CreditCardIcon,
		footerIcon: LockIcon,
		tag: "Automated Invoices & Payouts",
		title: "Guaranteed Escrow Protection",
		tone: "payments",
	},
	{
		copy: "Automatic timezone normalization, dynamic slot buffers, and flexible same-expert 24h rescheduling.",
		icon: CalendarIcon,
		footerIcon: GlobeIcon,
		tag: "Real-Time Timezone Engine",
		title: "Conflict-Free Smart Scheduling",
		tone: "scheduling",
	},
	{
		copy: "Receive concise executive action plans, key decision summaries, and automated follow-up milestones within seconds of call completion.",
		icon: SparklesIcon,
		footerIcon: BotIcon,
		tag: "Automated Clinical & Business Notes",
		title: "AI Post-Session Synthesis",
		tone: "synthesis",
	},
] as const;

const disciplines = [
	{
		copy: "Consult with board-certified physicians, clinical nutritionists, and mental wellness specialists with secure health document review and automated prescription follow-ups.",
		label: "Healthcare & Medicine",
		pill: "Clinical & Healthcare",
		title: "HIPAA-grade confidential medical consultations.",
	},
	{
		copy: "Work directly with experienced legal professionals for contracts, company formation, compliance, and high-stakes business decisions.",
		label: "Corporate & Law",
		pill: "Corporate & Legal",
		title: "Practical legal guidance without the waiting room.",
	},
	{
		copy: "Connect privately with qualified scholars for thoughtful guidance grounded in evidence, context, and trusted religious tradition.",
		label: "Islamic Guidance",
		pill: "Faith & Guidance",
		title: "Trusted guidance for complex personal questions.",
	},
	{
		copy: "Book senior technology leaders for architecture reviews, cloud strategy, security planning, and critical engineering decisions.",
		label: "Tech & Architecture",
		pill: "Technology Leadership",
		title: "Senior technical judgment, available on demand.",
	},
	{
		copy: "Get focused coaching from experienced operators who have led teams, scaled businesses, and navigated difficult career transitions.",
		label: "Executive Mentorship",
		pill: "Leadership & Strategy",
		title: "Clearer decisions from people who have been there.",
	},
] as const;

const questions = [
	[
		"How does payment escrow protection work?",
		"When you book a session, funds are securely held in escrow. The fee is only released to the expert after the session has taken place and been confirmed.",
	],
	[
		"Do I need to download Zoom or other software?",
		"No software or browser extension is needed. All video consultations run securely inside your browser using encrypted WebRTC technology.",
	],
	[
		"How are experts vetted on Laxiriir?",
		"Every practitioner undergoes an identity verification check, academic credential audit, and clinical/professional background review.",
	],
	[
		"What is your cancellation and rescheduling policy?",
		"Sessions can be rescheduled or cancelled with a full refund up to 24 hours prior to the scheduled start time.",
	],
] as const;

export function PenLanding() {
	return (
		<PublicShell>
			<main className="landing-page">
				<Hero />
				<SocialProof />
				<Features />
				<Disciplines />
				<FeaturedExperts />
				<Pricing />
				<Faq />
				<FinalCallToAction />
			</main>
		</PublicShell>
	);
}

function Hero() {
	const navigate = useNavigate();

	return (
		<section className="landing-hero overflow-hidden px-4 pt-16 pb-20 sm:px-6 lg:px-0">
			<div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center">
				<Badge
					className="landing-announcement h-7 gap-2 px-3.5"
					variant="secondary"
				>
					<span aria-hidden="true" className="size-2 rounded-full bg-current" />
					Next-Gen Video Consultation Platform
					<SparklesIcon data-icon="inline-end" />
				</Badge>
				<h1 className="max-w-[960px] text-balance font-extrabold text-4xl sm:text-6xl lg:text-[56px] lg:leading-[1.15]">
					Connect with vetted experts in real-time.
				</h1>
				<p className="max-w-[720px] text-pretty text-base text-muted-foreground leading-[1.55] sm:text-lg">
					Book confidential 1-on-1 consultations with verified doctors, legal
					advisors, religious scholars, and technology leaders directly in your
					browser.
				</p>
				<form
					className="w-full max-w-[620px]"
					onSubmit={(event) => {
						event.preventDefault();
						void navigate({ to: "/experts" });
					}}
				>
					<InputGroup className="h-12 bg-card shadow-sm">
						<InputGroupAddon>
							<SearchIcon />
						</InputGroupAddon>
						<InputGroupInput
							aria-label="Search experts"
							placeholder="Search by specialty, category, or expert name..."
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupButton
								className="h-9 px-4"
								type="submit"
								variant="default"
							>
								Find Expert
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
				</form>
				<div className="flex max-w-4xl flex-wrap items-center justify-center gap-2 text-xs">
					<span className="font-medium text-muted-foreground">
						Popular searches:
					</span>
					{[
						"🩺 Functional Health",
						"⚖️ Corporate Law",
						"📖 Islamic Guidance",
						"💻 AI & Cloud Architecture",
					].map((label) => (
						<Badge className="landing-quick-tag" key={label} variant="outline">
							{label}
						</Badge>
					))}
				</div>
				<div className="flex flex-wrap items-center justify-center gap-3.5">
					<Button asChild size="lg">
						<Link to="/register">
							Get Started Free
							<ArrowRightIcon data-icon="inline-end" />
						</Link>
					</Button>
					<Button asChild size="lg" variant="outline">
						<Link to="/experts">Explore All Experts</Link>
					</Button>
				</div>
				<div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-2 text-muted-foreground text-sm">
					<TrustItem icon={ShieldCheckIcon} label="100% Identity Vetted" />
					<TrustItem icon={VideoIcon} label="Sub-100ms HD Video" />
					<TrustItem icon={StarIcon} label="4.9/5 Client Rating" />
				</div>
				<ConsultationPreview />
				<div className="flex flex-wrap items-center justify-center gap-2 text-xs">
					<span className="font-medium text-muted-foreground">Popular:</span>
					{[
						"Cardiology & MD",
						"Islamic Estate Law",
						"Tax Strategy",
						"Cloud Architecture",
						"Executive Coaching",
					].map((label) => (
						<Badge
							className="landing-quick-tag"
							key={label}
							variant="secondary"
						>
							{label}
						</Badge>
					))}
				</div>
			</div>
		</section>
	);
}

function TrustItem({
	icon: Icon,
	label,
}: {
	icon: typeof ShieldCheckIcon;
	label: string;
}) {
	return (
		<span className="flex items-center gap-2">
			<Icon className="size-4 text-accent-foreground" />
			{label}
		</span>
	);
}

function ConsultationPreview() {
	return (
		<Card className="landing-preview w-full max-w-[1080px] gap-2.5 rounded-2xl p-3 text-left">
			<div className="flex h-7 items-center gap-2 border-b px-2">
				<div className="flex gap-1.5">
					<span className="size-2 rounded-full bg-destructive" />
					<span className="size-2 rounded-full bg-muted-foreground/40" />
					<span className="size-2 rounded-full bg-accent-foreground" />
				</div>
				<div className="mx-auto flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-[11px] text-muted-foreground">
					<LockIcon className="size-3" />
					app.laxiriir.expert/sessions/live-room
				</div>
				<Badge variant="secondary">Connected</Badge>
			</div>
			<div className="grid gap-3 lg:grid-cols-[720fr_324fr]">
				<div className="landing-video relative flex min-h-80 flex-col justify-between rounded-xl p-4 lg:min-h-[420px]">
					<div className="flex items-center justify-between text-xs">
						<Badge className="bg-white/10 text-white" variant="outline">
							Dr. Sarah Jensen, MD
						</Badge>
						<Badge className="bg-white/10 text-white" variant="outline">
							28:45 / 45:00
						</Badge>
					</div>
					<div className="flex flex-col items-center gap-4">
						<span className="flex size-18 items-center justify-center rounded-full bg-white/10">
							<UserRoundIcon className="size-8 text-white/55" />
						</span>
						<p className="text-sm text-white/60">
							HD 1080p Encrypted Stream Active
						</p>
						<Badge className="bg-accent-foreground text-primary-foreground">
							Dr. Sarah Jensen is speaking...
						</Badge>
					</div>
					<div className="flex justify-center gap-2">
						{[MicIcon, VideoIcon, Share2Icon].map((Icon, index) => (
							<Button
								aria-label={["Mute", "Stop video", "Share"][index]}
								className="border-white/15 bg-white/10 text-white hover:bg-white/20"
								key={Icon.displayName}
								size="icon-sm"
								variant="outline"
							>
								<Icon />
							</Button>
						))}
						<Button
							aria-label="Leave call"
							size="icon-sm"
							variant="destructive"
						>
							<PhoneOffIcon />
						</Button>
					</div>
				</div>
				<div className="landing-preview-panel flex flex-col justify-between gap-5 rounded-xl border p-4">
					<div>
						<p className="font-bold">Session Overview</p>
						<p className="text-muted-foreground text-xs">
							Functional Health & Nutrition
						</p>
					</div>
					<div className="rounded-lg border bg-card p-3">
						<p className="flex items-center gap-2 font-semibold text-xs">
							<SparklesIcon className="size-4 text-accent-foreground" />
							Live AI Summary
						</p>
						<p className="mt-3 text-muted-foreground text-xs leading-5">
							Reviewing comprehensive metabolic panel. Formulating personalized
							recovery protocol with clinical follow-ups.
						</p>
					</div>
					<div className="flex flex-col gap-3 text-xs">
						<ChecklistItem label="Symptom review completed" />
						<ChecklistItem label="Diagnostic lab analysis" />
						<ChecklistItem label="Follow-up schedule set" />
					</div>
					<div className="mt-auto flex items-center justify-between rounded-md border bg-card px-3 py-2 text-xs">
						<span className="flex items-center gap-2 font-medium">
							<ShieldCheckIcon className="size-4 text-accent-foreground" />
							Escrow Protected
						</span>
						<strong>$150.00</strong>
					</div>
				</div>
			</div>
		</Card>
	);
}

function ChecklistItem({ label }: { label: string }) {
	return (
		<span className="flex items-center gap-2">
			<CheckIcon className="size-4 text-accent-foreground" />
			{label}
		</span>
	);
}

function SocialProof() {
	return (
		<section className="landing-social-proof border-y px-4 py-9 sm:px-6">
			<div className="mx-auto flex max-w-7xl flex-col items-center gap-5">
				<p className="font-bold text-muted-foreground text-xs uppercase tracking-[0.18em]">
					Trusted by clients and practitioners worldwide
				</p>
				<div className="flex flex-wrap justify-center gap-x-12 gap-y-5 text-center font-bold text-[15px] uppercase">
					{[
						"Medcore Clinics",
						"Apex Legal Group",
						"Islamic Advisory",
						"Techventure Labs",
						"Global Strategy",
					].map((name) => (
						<span key={name}>{name}</span>
					))}
				</div>
			</div>
		</section>
	);
}

function SectionHeading({
	eyebrow,
	title,
	copy,
}: {
	eyebrow: string;
	title: string;
	copy?: string;
}) {
	return (
		<div className="landing-section-heading mx-auto flex max-w-[1080px] flex-col items-center gap-3 text-center">
			<p className="font-bold text-xs uppercase tracking-[0.1em]">{eyebrow}</p>
			<h2 className="text-balance font-extrabold text-3xl sm:text-[38px] sm:leading-[46px]">
				{title}
			</h2>
			{copy ? <p className="text-muted-foreground leading-6">{copy}</p> : null}
		</div>
	);
}

function Features() {
	return (
		<section className="landing-muted-section px-4 py-20 sm:px-6">
			<div className="mx-auto max-w-7xl">
				<SectionHeading
					copy="Every tool you need to run, scale, and attend world-class advisory sessions with zero technological friction."
					eyebrow="Infrastructure for Excellence"
					title="Engineered for high-stakes consultations."
				/>
				<div className="mx-auto mt-12 flex max-w-[1080px] flex-col gap-5">
					<div className="grid gap-5 md:grid-cols-[640fr_420fr]">
						{features.slice(0, 2).map((feature) => (
							<FeatureCard feature={feature} key={feature.tone} />
						))}
					</div>
					<div className="grid gap-5 md:grid-cols-[420fr_640fr]">
						{features.slice(2).map((feature) => (
							<FeatureCard feature={feature} key={feature.tone} />
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

function FeatureCard({ feature }: { feature: (typeof features)[number] }) {
	const Icon = feature.icon;
	const FooterIcon = feature.footerIcon;
	return (
		<Card
			className="landing-feature-card min-h-[280px] rounded-[14px] [--card-spacing:28px]"
			data-tone={feature.tone}
		>
			<CardHeader className="gap-3">
				<span className="landing-feature-icon flex size-11 items-center justify-center rounded-[10px]">
					<Icon className="size-5" />
				</span>
				<CardTitle className="font-bold text-xl leading-6">
					{feature.title}
				</CardTitle>
				<CardDescription className="landing-feature-copy leading-[1.5]">
					{feature.copy}
				</CardDescription>
			</CardHeader>
			<CardContent className="mt-auto">
				<p className="landing-feature-label flex items-center gap-1 font-semibold text-xs leading-5">
					<FooterIcon aria-hidden="true" className="size-3 shrink-0" />
					{feature.tag}
				</p>
			</CardContent>
		</Card>
	);
}

function Disciplines() {
	return (
		<section className="px-4 py-20 sm:px-6">
			<div className="mx-auto max-w-[1080px]">
				<SectionHeading
					eyebrow="Specialized Expertise"
					title="Tailored for distinct professional fields."
				/>
				<Tabs
					className="landing-disciplines mt-9 gap-9"
					defaultValue={disciplines[0].label}
				>
					<TabsList className="mx-auto max-w-full flex-wrap">
						{disciplines.map((discipline) => (
							<TabsTrigger key={discipline.label} value={discipline.label}>
								{discipline.label}
							</TabsTrigger>
						))}
					</TabsList>
					{disciplines.map((discipline) => (
						<TabsContent key={discipline.label} value={discipline.label}>
							<Card className="landing-discipline-card rounded-2xl p-6 sm:p-9">
								<div className="grid items-center gap-8 lg:grid-cols-[540fr_380fr] lg:gap-[88px]">
									<div className="flex flex-col items-start gap-4">
										<Badge
											className="landing-discipline-pill"
											variant="secondary"
										>
											{discipline.pill}
										</Badge>
										<h3 className="font-bold text-[26px] leading-tight">
											{discipline.title}
										</h3>
										<p className="max-w-[500px] text-muted-foreground text-sm leading-[1.6]">
											{discipline.copy}
										</p>
										<Button asChild className="h-auto p-0" variant="link">
											<Link to="/experts">
												Browse{" "}
												{discipline === disciplines[0]
													? "Healthcare"
													: discipline.label}{" "}
												Specialists
												<ArrowRightIcon data-icon="inline-end" />
											</Link>
										</Button>
									</div>
									<div className="landing-discipline-graphic flex min-h-[248px] flex-col items-center justify-center gap-3 rounded-xl p-5 text-center">
										<ShieldCheckIcon className="size-12" />
										<p className="font-semibold text-[13px] text-muted-foreground">
											Verified{" "}
											{discipline === disciplines[0]
												? "Medical"
												: "Professional"}{" "}
											Credentials Audited
										</p>
									</div>
								</div>
							</Card>
						</TabsContent>
					))}
				</Tabs>
			</div>
		</section>
	);
}

function FeaturedExperts() {
	const query = useExperts();
	const experts = query.data?.experts.slice(0, 3) ?? [];

	return (
		<section className="landing-muted-section px-4 py-20 sm:px-6">
			<div className="mx-auto max-w-[1080px]">
				<div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="font-bold text-xs uppercase tracking-[0.1em]">
							Top 1% Practitioners
						</p>
						<h2 className="mt-2.5 font-extrabold text-3xl sm:text-4xl">
							Featured Verified Experts
						</h2>
						<p className="mt-2.5 max-w-[600px] text-muted-foreground text-sm">
							Every expert undergoes rigorous identity verification, credential
							auditing, and peer-reviewed qualification.
						</p>
					</div>
					<Button asChild variant="outline">
						<Link to="/experts">
							View All Experts
							<ArrowRightIcon data-icon="inline-end" />
						</Link>
					</Button>
				</div>
				<div className="mt-12 grid gap-6 md:grid-cols-3">
					{query.isPending
						? [1, 2, 3].map((item) => <Skeleton className="h-72" key={item} />)
						: experts.map((expert, index) => (
								<Card
									className="landing-expert-card gap-4 rounded-[14px]"
									key={expert.id}
								>
									<CardHeader className="gap-4">
										<div className="flex items-center justify-between gap-3">
											<Avatar className="size-[52px]" size="lg">
												<AvatarImage alt="" src={expert.avatarUrl} />
												<AvatarFallback>
													{expert.displayName.slice(0, 2)}
												</AvatarFallback>
											</Avatar>
											<Badge
												className="landing-verified-badge"
												variant="secondary"
											>
												<ShieldCheckIcon data-icon="inline-start" />
												Verified
											</Badge>
										</div>
										<div className="flex flex-col gap-1">
											<CardTitle className="font-bold text-[17px]">
												{expert.displayName}
											</CardTitle>
											<CardDescription className="text-[13px]">
												{expert.title}
											</CardDescription>
										</div>
									</CardHeader>
									<CardContent className="flex items-center justify-between gap-4">
										<span className="flex items-center gap-1.5 font-semibold text-sm">
											<StarIcon className="landing-rating-star size-3.5 fill-current" />
											{index === 1
												? "5.0 (94)"
												: index === 2
													? "4.9 (82)"
													: "4.9 (128)"}
										</span>
										<strong>
											{formatPrice(expert.hourlyRateCents)}/session
										</strong>
									</CardContent>
									<CardFooter className="landing-card-footer pt-0">
										<Button asChild className="w-full">
											<Link params={{ id: expert.id }} to="/experts/$id">
												Book Consultation
											</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
				</div>
			</div>
		</section>
	);
}

function Pricing() {
	const clientFeatures = [
		"No membership or monthly subscription",
		"Browser-native encrypted 1080p video",
		"100% Escrow payment protection",
		"24-hour free cancellation & rescheduling",
	];
	const expertFeatures = [
		"Verified practitioner badge & SEO profile",
		"Automated calendar & timezone management",
		"Automated invoicing & 48h direct payouts",
		"AI post-session synthesis & notes generation",
	];

	return (
		<section className="px-4 py-20 sm:px-6">
			<div className="mx-auto max-w-7xl">
				<SectionHeading
					copy="No recurring subscription traps. Zero monthly fees for clients."
					eyebrow="Transparent Pricing"
					title="Simple, honest, performance-based."
				/>
				<div className="mx-auto mt-12 grid max-w-[860px] gap-6 md:grid-cols-2">
					<PricingCard
						buttonLabel="Join as Client"
						copy="Search, book, and meet with verified experts worldwide. You only pay for the sessions you book."
						features={clientFeatures}
						price="$0"
						priceNote="free platform access"
						title="For Clients"
						to="/register"
					/>
					<PricingCard
						buttonLabel="Apply as Verified Expert"
						copy="Full infrastructure access, automated billing, verified expert badge, and direct payouts to your bank."
						featured
						features={expertFeatures}
						price="10%"
						priceNote="per completed booking"
						title="For Verified Experts"
						to="/register"
					/>
				</div>
			</div>
		</section>
	);
}

function PricingCard({
	buttonLabel,
	copy,
	featured = false,
	features,
	price,
	priceNote,
	title,
	to,
}: {
	buttonLabel: string;
	copy: string;
	featured?: boolean;
	features: string[];
	price: string;
	priceNote: string;
	title: string;
	to: "/register";
}) {
	return (
		<Card
			className="landing-pricing-card min-h-[389px] gap-4 rounded-2xl [--card-spacing:32px]"
			data-featured={featured}
		>
			<CardHeader className="gap-4">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<CardTitle className="font-bold text-lg">{title}</CardTitle>
					{featured ? (
						<Badge className="landing-pricing-badge" variant="secondary">
							Top Practitioners
						</Badge>
					) : null}
				</div>
				<div className="flex items-baseline gap-1">
					<strong className="landing-price font-extrabold text-[40px] leading-[48px]">
						{price}
					</strong>
					<span className="font-medium text-[13px] text-muted-foreground">
						{priceNote}
					</span>
				</div>
				<CardDescription className="max-w-[306px] text-[13px] leading-4">
					{copy}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-2.5">
				{features.map((feature) => (
					<span
						className="flex items-center gap-2 font-medium text-[13px] leading-4"
						key={feature}
					>
						<CheckIcon className="size-4 shrink-0 text-accent-foreground" />
						{feature}
					</span>
				))}
			</CardContent>
			<CardFooter className="landing-card-footer mt-auto pt-2">
				<Button
					asChild
					className="w-full"
					variant={featured ? "default" : "outline"}
				>
					<Link to={to}>{buttonLabel}</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}

function Faq() {
	return (
		<section className="landing-faq px-4 py-20 sm:px-6">
			<div className="mx-auto max-w-[780px]">
				<SectionHeading
					eyebrow="Got Questions?"
					title="Frequently Asked Questions"
				/>
				<Accordion
					className="mt-10 gap-3.5"
					defaultValue={questions.map((_, index) => `question-${index}`)}
					type="multiple"
				>
					{questions.map(([question, answer], index) => (
						<AccordionItem
							className="rounded-[10px] px-5 ring-1 ring-border"
							key={question}
							value={`question-${index}`}
						>
							<AccordionTrigger className="pt-4 pb-2 text-[15px] leading-[18px] hover:no-underline">
								{question}
							</AccordionTrigger>
							<AccordionContent className="pb-4 text-[13px] text-muted-foreground leading-5">
								{answer}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</section>
	);
}

function FinalCallToAction() {
	return (
		<section className="px-4 py-[60px] sm:px-6">
			<div className="landing-cta mx-auto flex max-w-[1080px] flex-col items-center gap-5 rounded-[20px] border px-6 py-[54px] text-center sm:px-12">
				<h2 className="text-balance font-extrabold text-3xl sm:text-4xl sm:leading-[44px]">
					Ready to elevate your consultation experience?
				</h2>
				<p className="landing-cta-copy">
					Join thousands of clients and verified professionals connecting daily
					on Laxiriir.
				</p>
				<Button asChild variant="secondary">
					<Link to="/experts">
						Find an Expert Now
						<ArrowRightIcon data-icon="inline-end" />
					</Link>
				</Button>
			</div>
		</section>
	);
}
