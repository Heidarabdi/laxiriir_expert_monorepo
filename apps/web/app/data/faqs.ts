export interface FAQItem {
	answer: string;
	category: "Booking" | "Payments" | "Privacy" | "Trust";
	question: string;
}

export const faqs: FAQItem[] = [
	{
		answer:
			"Every expert goes through identity verification, professional background review, and a trust check before becoming bookable on the platform.",
		category: "Trust",
		question: "How do I know the experts are legitimate?",
	},
	{
		answer:
			"Yes. Sessions are designed to remain private between the client and expert, with secure session access and strict handling of sensitive booking and account data.",
		category: "Privacy",
		question: "Are consultations private and secure?",
	},
	{
		answer:
			"You choose an available slot, confirm the session format, complete payment, and then receive a confirmed booking that appears in your account.",
		category: "Booking",
		question: "How does booking work?",
	},
	{
		answer:
			"Yes. Sessions can be rescheduled or cancelled within the policy window shown at booking time. Those rules will later be enforced per booking and expert policy.",
		category: "Booking",
		question: "Can I reschedule or cancel a session?",
	},
	{
		answer:
			"Payments are collected securely at booking, and the platform tracks booking status, payout state, and refund handling as part of the transaction record.",
		category: "Payments",
		question: "How are payments handled?",
	},
	{
		answer:
			"Experts receive payouts after completed sessions based on the platform payout schedule and any review, refund, or dispute status tied to the booking.",
		category: "Payments",
		question: "When do experts receive payouts?",
	},
	{
		answer:
			"Yes. The same account system supports clients, experts, and admins, with role-based access deciding which dashboard and actions each user can access.",
		category: "Trust",
		question: "Do clients and experts use the same authentication system?",
	},
	{
		answer:
			"The platform is built for doctors, advisors, tutors, consultants, and other high-trust experts whose sessions require scheduling, payment, and secure live interaction.",
		category: "Trust",
		question: "Who is this platform for?",
	},
];
