import type { ExpertSummary } from "@repo/contracts/consultations";
import { Link } from "@tanstack/react-router";
import {
	ArrowDownIcon,
	ArrowRightIcon,
	RefreshCwIcon,
	SearchIcon,
} from "lucide-react";
import { useState } from "react";

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
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useExperts } from "@/hooks/use-consultations";
import { searchExperts } from "@/lib/expert-search";

const steps = [
	{
		title: "Find your kind of expert.",
		copy: "Explore their background, specialty, and listed rate. Save profiles to come back to when you’re ready.",
	},
	{
		title: "Make time for the conversation.",
		copy: "Open a profile to see available slots. Choose a time that works for you and confirm your booking.",
	},
	{
		title: "Keep the details together.",
		copy: "Find your bookings, message your expert, and manage changes from your client workspace.",
	},
];

const questions = [
	{
		question: "Can I look around before creating an account?",
		answer:
			"Yes. You can browse the expert directory, read profiles, and explore available times without an account. Sign in when you’re ready to book or save an expert.",
	},
	{
		question: "How do I choose the right expert?",
		answer:
			"Start with the question you want help with. Compare specialties, biographies, and listed rates, then check each expert’s available times. You can save profiles in your client workspace to revisit later.",
	},
	{
		question: "What if I need to change my booking?",
		answer:
			"Open the booking in your client workspace. Confirmed bookings can be cancelled or moved to another available slot with the same expert at least 24 hours before the start time.",
	},
	{
		question: "Can I join as an expert?",
		answer:
			"Yes. Choose the expert role when creating an account, then complete your profile. You can manage your profile, availability, and client bookings from the expert workspace. Public listing is subject to account approval.",
	},
];

export function RevisedLanding() {
	return (
		<PublicShell landingVariant="revised">
			<main id="main-content" className="landing-revised">
				<section aria-labelledby="landing-title" className="revised-hero">
					<div className="revised-container revised-hero-copy flex flex-col items-center gap-6 text-center">
						<p className="font-medium text-primary text-sm">
							A little perspective goes a long way.
						</p>
						<h1 id="landing-title" className="revised-hero-title">
							Good advice.
							<br />
							<span className="text-primary">Clearer decisions.</span>
						</h1>
						<p className="max-w-md text-lg text-muted-foreground leading-relaxed">
							Find someone who understands your challenge. Compare experts,
							choose a time, and take your next step.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-3">
							<Button asChild size="lg">
								<a href="#find-experts">
									Find an expert
									<ArrowRightIcon data-icon="inline-end" />
								</a>
							</Button>
							<Button asChild size="lg" variant="ghost">
								<a href="#how-it-works">
									How it works
									<ArrowDownIcon data-icon="inline-end" />
								</a>
							</Button>
						</div>
						<p className="text-muted-foreground text-sm">
							Browse profiles before you sign up.
						</p>
					</div>
					<img
						className="revised-hero-art"
						src="/images/consultation-illustration.png"
						alt=""
						aria-hidden="true"
						width={1672}
						height={941}
						fetchPriority="high"
					/>
				</section>

				<section
					id="how-it-works"
					aria-labelledby="how-title"
					className="revised-container revised-process"
				>
					<div className="max-w-sm">
						<h2 id="how-title" className="revised-section-title">
							From a question
							<br />
							to a next step.
						</h2>
						<p className="mt-5 text-muted-foreground leading-relaxed">
							Less searching in circles. More time with someone who can help you
							think it through.
						</p>
					</div>
					<div className="divide-y divide-border">
						{steps.map((step) => (
							<div className="py-6 first:pt-0 last:pb-0" key={step.title}>
								<h3 className="font-semibold text-xl tracking-tight">
									{step.title}
								</h3>
								<p className="mt-3 max-w-lg text-muted-foreground leading-relaxed">
									{step.copy}
								</p>
							</div>
						))}
					</div>
				</section>

				<ExpertDirectory />

				<section
					aria-labelledby="expert-invite-title"
					className="revised-container py-16 md:py-24"
				>
					<div className="revised-invite flex flex-col items-start gap-8 rounded-2xl border p-7 md:flex-row md:items-center md:justify-between md:p-12">
						<div className="max-w-xl">
							<h2 id="expert-invite-title" className="revised-section-title">
								Your experience could
								<br />
								be someone’s next step.
							</h2>
							<p className="mt-5 max-w-lg text-muted-foreground leading-relaxed">
								Create an expert profile, set your availability, and make room
								for the conversations you’re best placed to have.
							</p>
						</div>
						<Button asChild size="lg" className="shrink-0">
							<Link to="/register">
								Join as an expert
								<ArrowRightIcon data-icon="inline-end" />
							</Link>
						</Button>
					</div>
				</section>

				<section
					aria-labelledby="questions-title"
					className="revised-container grid gap-10 pb-20 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:pb-28"
				>
					<div>
						<h2 id="questions-title" className="revised-section-title">
							Before you begin.
						</h2>
						<p className="mt-5 text-muted-foreground">
							Something else on your mind?
						</p>
						<Button asChild variant="link" className="mt-2 h-auto p-0">
							<Link to="/contact">
								Talk to us
								<ArrowRightIcon data-icon="inline-end" />
							</Link>
						</Button>
					</div>
					<Accordion type="single" collapsible>
						{questions.map((item) => (
							<AccordionItem key={item.question} value={item.question}>
								<AccordionTrigger className="py-5 text-base">
									{item.question}
								</AccordionTrigger>
								<AccordionContent className="max-w-xl text-muted-foreground leading-relaxed">
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</section>
			</main>
		</PublicShell>
	);
}

function ExpertDirectory() {
	const query = useExperts();
	const [search, setSearch] = useState("");
	const experts = query.data?.experts ?? [];
	const matches = searchExperts(experts, search);
	const categories = [
		...new Set(experts.map((expert) => expert.category).filter(Boolean)),
	].slice(0, 6);

	return (
		<section
			id="find-experts"
			aria-labelledby="experts-title"
			className="revised-directory border-y py-16 md:py-24"
		>
			<div className="revised-container">
				<div className="max-w-xl">
					<h2 id="experts-title" className="revised-section-title">
						Who can help you move forward?
					</h2>
					<p className="mt-5 text-muted-foreground leading-relaxed">
						Start with a name, a specialty, or the question you’re working on.
					</p>
				</div>
				<div className="mt-9 flex flex-col gap-4">
					<Label htmlFor="landing-expert-search">Search experts</Label>
					<InputGroup className="h-12 max-w-xl bg-background">
						<InputGroupInput
							id="landing-expert-search"
							type="search"
							placeholder="Try a specialty or a name"
							value={search}
							onChange={(event) => setSearch(event.target.value)}
							aria-controls="landing-expert-results"
						/>
						<InputGroupAddon>
							<SearchIcon aria-hidden="true" />
						</InputGroupAddon>
					</InputGroup>
					{categories.length > 0 && (
						<fieldset
							className="flex flex-wrap gap-2"
							aria-label="Search by specialty"
						>
							<Button
								size="sm"
								variant={!search ? "secondary" : "outline"}
								aria-pressed={!search}
								onClick={() => setSearch("")}
							>
								All specialties
							</Button>
							{categories.map((category) => (
								<Button
									key={category}
									size="sm"
									variant={search === category ? "secondary" : "outline"}
									aria-pressed={search === category}
									onClick={() => setSearch(category)}
								>
									{category}
								</Button>
							))}
						</fieldset>
					)}
				</div>
				<div
					id="landing-expert-results"
					className="mt-8"
					aria-busy={query.isPending}
				>
					{query.isPending ? (
						<div role="status" className="grid gap-4">
							<span className="sr-only">Loading experts</span>
							{[0, 1, 2].map((index) => (
								<Skeleton key={index} className="h-40 w-full rounded-xl" />
							))}
						</div>
					) : query.isError ? (
						<Empty className="border bg-background py-12">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<RefreshCwIcon />
								</EmptyMedia>
								<EmptyTitle>We couldn’t load the directory.</EmptyTitle>
								<EmptyDescription>
									Please try again in a moment. Your search will stay here.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button
									variant="outline"
									disabled={query.isFetching}
									onClick={() => void query.refetch()}
								>
									{query.isFetching ? "Trying again…" : "Try again"}
								</Button>
							</EmptyContent>
						</Empty>
					) : matches.length === 0 ? (
						<Empty className="border bg-background py-12">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<SearchIcon />
								</EmptyMedia>
								<EmptyTitle>
									{experts.length
										? "No experts match that search."
										: "The directory is quiet for now."}
								</EmptyTitle>
								<EmptyDescription>
									{experts.length
										? "Try a different name or specialty, or see all experts."
										: "Expert profiles will appear here when they’re available."}
								</EmptyDescription>
							</EmptyHeader>
							{search && (
								<EmptyContent>
									<Button variant="outline" onClick={() => setSearch("")}>
										Clear search
									</Button>
								</EmptyContent>
							)}
						</Empty>
					) : (
						<>
							<p role="status" className="mb-4 text-muted-foreground text-sm">
								{matches.length > 3
									? `Showing 3 of ${matches.length} matching experts`
									: `${matches.length} ${matches.length === 1 ? "expert" : "experts"} to explore`}
							</p>
							<div className="grid gap-4">
								{matches.slice(0, 3).map((expert) => (
									<ExpertRow key={expert.id} expert={expert} />
								))}
							</div>
						</>
					)}
				</div>
				<Button asChild variant="link" className="mt-6 px-0">
					<Link to="/experts">
						Open the full directory
						<ArrowRightIcon data-icon="inline-end" />
					</Link>
				</Button>
			</div>
		</section>
	);
}

function ExpertRow({ expert }: { expert: ExpertSummary }) {
	const price = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2,
	}).format(expert.hourlyRateCents / 100);
	return (
		<Card className="revised-expert-row py-6 shadow-none">
			<CardContent className="grid gap-6 px-6 sm:grid-cols-[auto_1fr] lg:grid-cols-[auto_1fr_auto] lg:items-center">
				<Avatar className="size-16 rounded-xl sm:size-20">
					<AvatarImage
						className="object-cover"
						src={expert.avatarUrl}
						alt=""
						loading="lazy"
					/>
					<AvatarFallback className="rounded-xl bg-accent text-accent-foreground text-xl">
						{expert.displayName.slice(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-3">
						<h3 className="font-semibold text-xl tracking-tight">
							<Link
								to="/experts/$id"
								params={{ id: expert.id }}
								className="rounded-sm hover:underline focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-4"
							>
								{expert.displayName}
							</Link>
						</h3>
						<Badge variant="secondary">{expert.category}</Badge>
					</div>
					<p className="mt-1 text-primary text-sm">{expert.title}</p>
					<p className="mt-3 line-clamp-2 max-w-xl text-pretty text-muted-foreground text-sm leading-relaxed">
						{expert.bio}
					</p>
				</div>
				<div className="flex items-center justify-between gap-6 border-t pt-5 sm:col-start-2 lg:col-start-auto lg:flex-col lg:items-end lg:gap-3 lg:border-t-0 lg:pt-0">
					<p className="text-right text-muted-foreground text-sm">
						Listed rate{" "}
						<span className="ml-1 font-semibold text-foreground">{price}</span>
					</p>
					<Button asChild variant="outline">
						<Link to="/experts/$id" params={{ id: expert.id }}>
							View profile
							<ArrowRightIcon data-icon="inline-end" />
						</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
