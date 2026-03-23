import type {
	AvailabilityWindow,
	ExpertCategory,
	ExpertProfile,
	SessionOffer,
} from "~/types/experts";

function makeOffers(basePrice: number): SessionOffer[] {
	return [
		{
			description: "A focused intro call to align on goals and urgency.",
			durationMinutes: 25,
			id: "intro",
			label: "Intro Session",
			price: Math.round(basePrice * 0.6),
		},
		{
			description: "The standard deep-dive consultation with clear action items.",
			durationMinutes: 50,
			id: "standard",
			label: "Core Session",
			price: basePrice,
		},
		{
			description: "Extended working session for audits, planning, or layered review.",
			durationMinutes: 80,
			id: "extended",
			label: "Extended Session",
			price: Math.round(basePrice * 1.5),
		},
	];
}

const defaultWeek = [
	{
		dateLabel: "Today · 23 Mar",
		dayLabel: "Mon",
		id: "mon-23-mar",
		isToday: true,
		slots: [
			{ available: true, id: "mon-0900", startsAt: "2026-03-23T09:00:00+03:00", timeLabel: "09:00 AM" },
			{ available: true, id: "mon-1130", startsAt: "2026-03-23T11:30:00+03:00", timeLabel: "11:30 AM" },
			{ available: false, id: "mon-1400", startsAt: "2026-03-23T14:00:00+03:00", timeLabel: "02:00 PM" },
		],
	},
	{
		dateLabel: "Tue · 24 Mar",
		dayLabel: "Tue",
		id: "tue-24-mar",
		slots: [
			{ available: true, id: "tue-1000", startsAt: "2026-03-24T10:00:00+03:00", timeLabel: "10:00 AM" },
			{ available: true, id: "tue-1330", startsAt: "2026-03-24T13:30:00+03:00", timeLabel: "01:30 PM" },
			{ available: true, id: "tue-1700", startsAt: "2026-03-24T17:00:00+03:00", timeLabel: "05:00 PM" },
		],
	},
	{
		dateLabel: "Wed · 25 Mar",
		dayLabel: "Wed",
		id: "wed-25-mar",
		slots: [
			{ available: false, id: "wed-0900", startsAt: "2026-03-25T09:00:00+03:00", timeLabel: "09:00 AM" },
			{ available: true, id: "wed-1200", startsAt: "2026-03-25T12:00:00+03:00", timeLabel: "12:00 PM" },
			{ available: true, id: "wed-1600", startsAt: "2026-03-25T16:00:00+03:00", timeLabel: "04:00 PM" },
		],
	},
];

export const experts: ExpertProfile[] = [
	{
		availabilityMonth: "March 2026",
		bookingDays: defaultWeek,
		bio: [
			"Dr. Sarah Vance works at the intersection of behavioral science, executive clarity, and decision pressure. Her sessions are structured for founders and operators who need fast diagnosis and practical change.",
			"She combines clinical rigor with performance frameworks so the outcome of each conversation is a smaller, cleaner problem space and a sharper operating plan.",
		],
		category: "Strategy",
		experience: [
			{
				company: "Quantico Systems Intelligence",
				description: "Built decision frameworks for leadership teams navigating fundraising, burnout, and high-stakes hiring.",
				title: "Lead Performance Consultant",
				year: "2018 — Present",
			},
			{
				company: "Stanford Institute for Neuro-Studies",
				description: "Researched cognitive resilience under stress and translated findings into coaching systems.",
				title: "Clinical Psychologist (PhD)",
				year: "2012 — 2018",
			},
		],
		id: "1",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAEjThFx4oPPLp3XuZvZHpf9Y6xWKGZCB8ycsLiq445mWCc5sN-lI3-lx5j7n2fbBTZ1RfHKkJI7KisE5BWhVy2bSiqnzjbbq9smWrra577eXV9UH2WAxPURq_uVFUTMvUjxrdHXDEdqlbu_E7BkWydTd3kkSga_4Y3VhPJGnxLeHJm148VfdRd0hQHrk7biZWV3JNXFIb4zxO9HZn-gYD5HMYq29cAwu0gn5mgaLK9NkVzaJ7lX9p2G5RJIscaQ8441g-6AVLyfwY",
		languages: ["English", "German", "French"],
		name: "Dr. Sarah Vance",
		nextSlot: "Today at 11:30 AM EAT",
		rating: 4.9,
		reviews: [
			{
				author: "Marcus V.",
				authorTitle: "CEO, Nexus Capital",
				id: "sarah-review-1",
				text: "She did not waste a minute. By the end of the session, the problem was reframed and the next three decisions were obvious.",
			},
			{
				author: "Elena R.",
				authorTitle: "Project Director",
				id: "sarah-review-2",
				text: "A surgical consultation style. Direct, grounded, and genuinely useful after one session.",
			},
		],
		reviewsCount: 124,
		responseTime: "Under 2 hours",
		sessionOffers: makeOffers(250),
		shortBio: "High-performance strategy advisor for founders and operators under pressure.",
		tags: ["Executive Coaching", "Decision Design", "Burnout Mitigation", "Systems Thinking"],
		title: "Exit Strategy Expert",
		verificationNote: "Identity and professional background verified",
	},
	{
		availabilityMonth: "March 2026",
		bookingDays: [
			{
				dateLabel: "Today · 23 Mar",
				dayLabel: "Mon",
				id: "marcus-mon",
				isToday: true,
				slots: [
					{ available: false, id: "marcus-mon-0900", startsAt: "2026-03-23T09:00:00+03:00", timeLabel: "09:00 AM" },
					{ available: true, id: "marcus-mon-1500", startsAt: "2026-03-23T15:00:00+03:00", timeLabel: "03:00 PM" },
				],
			},
			{
				dateLabel: "Thu · 26 Mar",
				dayLabel: "Thu",
				id: "marcus-thu",
				slots: [
					{ available: true, id: "marcus-thu-1030", startsAt: "2026-03-26T10:30:00+03:00", timeLabel: "10:30 AM" },
					{ available: true, id: "marcus-thu-1800", startsAt: "2026-03-26T18:00:00+03:00", timeLabel: "06:00 PM" },
				],
			},
		],
		bio: [
			"Marcus Chen helps teams design cloud systems that survive scale, growth, and operational chaos. His advisory work focuses on architecture, reliability, and delivery speed.",
			"He is often brought in when platform teams have too many moving parts and too little clarity on the right sequence of changes.",
		],
		category: "Tech",
		experience: [
			{
				company: "Northstar Compute",
				description: "Led cloud architecture reviews and incident hardening programs for SaaS platforms across EMEA.",
				title: "Cloud Infrastructure Lead",
				year: "2020 — Present",
			},
			{
				company: "Hashgrid Labs",
				description: "Built ML infrastructure and developer-platform tooling for high-throughput data products.",
				title: "Platform Engineer",
				year: "2015 — 2020",
			},
		],
		id: "2",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDY6EwRN-OFUZYysJHZ05jtjH1CN-5ODpYwv6bMeVt6Ibq3C2E-yYRoHlRhNMJzNr582eE-V4v0eXlEVWvOeZBb-jaXxuhr-2QFllv9Ax9gJcSxla6SLDtbb7063Fv4xoffM0Ii2Y6fB37RGbCpy38VZSSEAv--SWdyKE0dx9zR6BpfyAjf-5AiBpgokZ5DLgbCJdGTyYAIssGYz_ZK0xYcsVB5rtpRXi__VbS8kIR3asMwCObjbMAUWIgQbuXnqSbbgXN5WCIgUbg",
		languages: ["English", "Mandarin"],
		name: "Marcus Chen",
		nextSlot: "Today at 03:00 PM EAT",
		rating: 5.0,
		reviews: [
			{
				author: "Tariq H.",
				authorTitle: "CTO, Overland",
				id: "marcus-review-1",
				text: "He compressed three months of architecture uncertainty into one session with clear priorities.",
			},
			{
				author: "Nadia K.",
				authorTitle: "Engineering Manager",
				id: "marcus-review-2",
				text: "Strong balance between systems depth and practical delivery tradeoffs.",
			},
		],
		reviewsCount: 89,
		responseTime: "Within 4 hours",
		sessionOffers: makeOffers(185),
		shortBio: "Cloud and platform advisor for teams scaling infrastructure under real load.",
		tags: ["Cloud Architecture", "Reliability", "Platform Strategy", "ML Ops"],
		title: "Cloud Infrastructure",
		verificationNote: "Identity and technical background verified",
	},
	{
		availabilityMonth: "March 2026",
		bookingDays: defaultWeek,
		bio: [
			"Dr. Elena Rodriguez advises biotech founders and operators on product-market fit, clinical positioning, and strategic narrative under regulatory pressure.",
			"Her sessions are especially useful when a team needs a sharp external lens before fundraising or category expansion.",
		],
		category: "Medical",
		experience: [
			{
				company: "Arc Bio Advisory",
				description: "Advised early-stage health ventures on clinical strategy and commercial positioning.",
				title: "Biotech Advisor",
				year: "2019 — Present",
			},
			{
				company: "Medisyn Research",
				description: "Ran translational programs across diagnostics and regulated product launches.",
				title: "Research Lead",
				year: "2013 — 2019",
			},
		],
		id: "3",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuAubkF6SzsVhLlLmSHwYEH0SFcUuTK7iArQBvf2wY99sMEwMiyybHmoM0sEUa56O4IWwgnU1i3ziCZF5d3T_URagEB8NzweD-3qhGC5pZmlwKQ797SbaPCFXE1nmgVr3dIWEEGjFw3uiWM-ryoe7U6suGvekMZHoyce1x9QAPuTbu0iLq2_PHO1GvE9oVLohZvAg3uu2GZe9pw6pKvrB9KjQiy81rgTCApnZCNCphbfTAur1Fqkt5eCm0vai-QPeQg5H0keYpeuBJc",
		languages: ["English", "Spanish"],
		name: "Dr. Elena Rodriguez",
		nextSlot: "Tue at 10:00 AM EAT",
		rating: 4.8,
		reviews: [
			{
				author: "Rami S.",
				authorTitle: "Founder, Clinmark",
				id: "elena-review-1",
				text: "Elena sees both the science and the story. That combination is rare and extremely valuable.",
			},
			{
				author: "Yasmin O.",
				authorTitle: "Operator, MedScale",
				id: "elena-review-2",
				text: "Her session helped us simplify our clinical narrative without losing rigor.",
			},
		],
		reviewsCount: 210,
		responseTime: "Within 6 hours",
		sessionOffers: makeOffers(320),
		shortBio: "Biotech advisor for clinical positioning, health ventures, and regulated product growth.",
		tags: ["Biotech Strategy", "Clinical Positioning", "Health Ventures", "Fundraising Prep"],
		title: "Biotech Advisor",
		verificationNote: "Identity and professional background verified",
	},
	{
		availabilityMonth: "March 2026",
		bookingDays: [
			{
				dateLabel: "Today · 23 Mar",
				dayLabel: "Mon",
				id: "julian-mon",
				isToday: true,
				slots: [
					{ available: true, id: "julian-mon-1230", startsAt: "2026-03-23T12:30:00+03:00", timeLabel: "12:30 PM" },
					{ available: true, id: "julian-mon-1700", startsAt: "2026-03-23T17:00:00+03:00", timeLabel: "05:00 PM" },
				],
			},
			{
				dateLabel: "Fri · 27 Mar",
				dayLabel: "Fri",
				id: "julian-fri",
				slots: [
					{ available: true, id: "julian-fri-0900", startsAt: "2026-03-27T09:00:00+03:00", timeLabel: "09:00 AM" },
				],
			},
		],
		bio: [
			"Julian Pierce helps operators build growth systems that are measurable, calm, and repeatable. His sessions focus on acquisition, retention, and team execution.",
			"He is particularly useful when a product has momentum but leadership is not yet aligned on the right operating model.",
		],
		category: "Strategy",
		experience: [
			{
				company: "Northbound Growth",
				description: "Designed go-to-market programs for product-led SaaS teams entering new regions.",
				title: "Growth Architect",
				year: "2021 — Present",
			},
			{
				company: "Orbit Commerce",
				description: "Led lifecycle and experimentation programs across acquisition and activation funnels.",
				title: "Growth Lead",
				year: "2016 — 2021",
			},
		],
		id: "4",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDfI1WgKD9uMZwZi9xJpk1YEZScPfsFy0eycD3PEx7iuql7_C2XM5qEF5inBp-th9rtJ8JWAYuu92UBYtbud8sxI-1YI_wH2xvYZLQFMDCmVXPlgSM_d8hmq6VkSRw_rEHlj_3Wrz5FSFxNrHrZYB1DNfeQbeEXLio-I3y8u0OQMMc7bRzo1lT4m-ltLQhtsSPkwn15QH36EQgg5YxcftaMqVIIyMjWuElffszv2cC5aFVqkPHMZ4ArfrSJYwquSlMUDN_HQy4JGyY",
		languages: ["English"],
		name: "Julian Pierce",
		nextSlot: "Today at 12:30 PM EAT",
		rating: 4.9,
		reviews: [
			{
				author: "Amina J.",
				authorTitle: "COO, Runa",
				id: "julian-review-1",
				text: "Julian gave us a decision frame instead of random growth tactics. That changed how we plan.",
			},
			{
				author: "Leo M.",
				authorTitle: "Founder",
				id: "julian-review-2",
				text: "Sharp commercial advice with very little fluff.",
			},
		],
		reviewsCount: 96,
		responseTime: "Same day",
		sessionOffers: makeOffers(210),
		shortBio: "Growth strategist for founders and operators aligning go-to-market with real execution.",
		tags: ["Growth Design", "Acquisition", "Activation", "Team Planning"],
		title: "Growth Architect",
		verificationNote: "Identity and professional background verified",
	},
	{
		availabilityMonth: "March 2026",
		bookingDays: [
			{
				dateLabel: "Wed · 25 Mar",
				dayLabel: "Wed",
				id: "anton-wed",
				slots: [
					{ available: true, id: "anton-wed-1100", startsAt: "2026-03-25T11:00:00+03:00", timeLabel: "11:00 AM" },
					{ available: true, id: "anton-wed-1430", startsAt: "2026-03-25T14:30:00+03:00", timeLabel: "02:30 PM" },
				],
			},
			{
				dateLabel: "Sat · 28 Mar",
				dayLabel: "Sat",
				id: "anton-sat",
				slots: [
					{ available: true, id: "anton-sat-1000", startsAt: "2026-03-28T10:00:00+03:00", timeLabel: "10:00 AM" },
				],
			},
		],
		bio: [
			"Anton Berg helps product teams sharpen interfaces, decision density, and design system coherence. His advice is practical and architecture-minded.",
			"He is most useful when a team has a working product that lacks consistency, hierarchy, or product taste.",
		],
		category: "Design",
		experience: [
			{
				company: "Northline Studio",
				description: "Led systemic UI redesigns for B2B tools that had grown beyond their original design language.",
				title: "Systemic UI Designer",
				year: "2020 — Present",
			},
			{
				company: "Atlas Product",
				description: "Built design systems and interaction models for high-density analytics interfaces.",
				title: "Senior Product Designer",
				year: "2014 — 2020",
			},
		],
		id: "5",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuD8rWY9Bl09IioLc3O_0E9Cfgo0ufXBUK0Nsb97VOLQEFsYAfJfwXtFJbAM-uyOZ3-V225n7yZd6ImA7QN3jE1cHLI_OBxNX0ZfJd6NS-pFELwodQwEioPgZp2C6nU4_h7-fjo_IcQWHyUIkoqERXIXviez7OkAsDoQAUEDI0lEF_Q1mo6U8RLgZqSZSC29xTGVSeliJcBLJ7GXh6FdztKlTH8V81AEUY0vjtGhQaWIEObUizCdGbq4pARoSF8NgaZAM5968PG9vRA",
		languages: ["English", "Swedish"],
		name: "Anton Berg",
		nextSlot: "Wed at 11:00 AM EAT",
		rating: 5.0,
		reviews: [
			{
				author: "Sara N.",
				authorTitle: "Head of Product",
				id: "anton-review-1",
				text: "He immediately saw what was inconsistent in our product and gave us a design system path we could actually ship.",
			},
			{
				author: "Bilal A.",
				authorTitle: "Founder",
				id: "anton-review-2",
				text: "Strong product taste without disappearing into vague design language.",
			},
		],
		reviewsCount: 57,
		responseTime: "Within 12 hours",
		sessionOffers: makeOffers(160),
		shortBio: "Design systems and product-clarity advisor for teams cleaning up mature interfaces.",
		tags: ["Design Systems", "UI Architecture", "Product Taste", "Interface Audit"],
		title: "Systemic UI Designer",
		verificationNote: "Identity and professional background verified",
	},
	{
		availabilityMonth: "March 2026",
		bookingDays: [
			{
				dateLabel: "Tue · 24 Mar",
				dayLabel: "Tue",
				id: "sasha-tue",
				slots: [
					{ available: true, id: "sasha-tue-0900", startsAt: "2026-03-24T09:00:00+03:00", timeLabel: "09:00 AM" },
					{ available: true, id: "sasha-tue-1600", startsAt: "2026-03-24T16:00:00+03:00", timeLabel: "04:00 PM" },
				],
			},
			{
				dateLabel: "Thu · 26 Mar",
				dayLabel: "Thu",
				id: "sasha-thu",
				slots: [
					{ available: false, id: "sasha-thu-1100", startsAt: "2026-03-26T11:00:00+03:00", timeLabel: "11:00 AM" },
					{ available: true, id: "sasha-thu-1900", startsAt: "2026-03-26T19:00:00+03:00", timeLabel: "07:00 PM" },
				],
			},
		],
		bio: [
			"Sasha Volkov supports teams building ML and data infrastructure that has to work in production, not just in notebooks. Sessions focus on operational clarity and deployment readiness.",
			"He is a strong fit when teams are struggling with model delivery, observability, or platform ownership around AI systems.",
		],
		category: "Tech",
		experience: [
			{
				company: "Signal Forge",
				description: "Designed ML delivery pipelines for data-heavy products moving from prototypes to platform teams.",
				title: "ML Ops Engineer",
				year: "2021 — Present",
			},
			{
				company: "Deepframe Labs",
				description: "Worked across data engineering and inference operations for applied AI products.",
				title: "Data Platform Engineer",
				year: "2016 — 2021",
			},
		],
		id: "6",
		image:
			"https://lh3.googleusercontent.com/aida-public/AB6AXuDz2-nvuyJ6bJVKNoIgbOnSvF2ItSMtJjAyCdIaQOVVe_RpK-yTFCjBnGJAtukBXZWGVUmXLiJRr2UsPGSfB_HVMY7j5YLC4Clvz55BCQfOI4psRlzTKpEjX-EdCSNUEAsrVOtTJMEn5DwYap0EkFUH8kCeQ4CiguotO2b1RIAyrsO5fCmI_vQ7iG-yeAZMYmFV_vAhyxEwE-tRa16E5KbK50GwIBjvs82GdNnqCAf56DrZPnPXRpfT_jjmqJo5ZGCuwv5OezdHmjg",
		languages: ["English", "Russian"],
		name: "Sasha Volkov",
		nextSlot: "Tue at 09:00 AM EAT",
		rating: 4.7,
		reviews: [
			{
				author: "Hassan B.",
				authorTitle: "VP Engineering",
				id: "sasha-review-1",
				text: "Sasha is excellent when the team needs someone who can separate ML hype from infrastructure reality.",
			},
			{
				author: "Mira C.",
				authorTitle: "Data Lead",
				id: "sasha-review-2",
				text: "Our deployment plan got dramatically simpler after one session.",
			},
		],
		reviewsCount: 64,
		responseTime: "Within 8 hours",
		sessionOffers: makeOffers(195),
		shortBio: "ML Ops and platform advisor for AI systems that need real production discipline.",
		tags: ["ML Ops", "Data Platform", "Inference Systems", "Observability"],
		title: "ML Ops Engineer",
		verificationNote: "Identity and technical background verified",
	},
];

export const expertCategories: Array<"All" | ExpertCategory> = [
	"All",
	"Medical",
	"Strategy",
	"Tech",
	"Design",
];

export function getExpertById(id: string) {
	return experts.find((expert) => expert.id === id);
}

export function getStartingPrice(expert: ExpertProfile) {
	return Math.min(...expert.sessionOffers.map((offer) => offer.price));
}

export function matchesAvailabilityWindow(
	expert: ExpertProfile,
	window: AvailabilityWindow,
) {
	if (window === "today") {
		return expert.bookingDays.some(
			(day) => day.isToday && day.slots.some((slot) => slot.available),
		);
	}

	return expert.bookingDays.some((day) => day.slots.some((slot) => slot.available));
}
